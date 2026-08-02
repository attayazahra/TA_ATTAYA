package admin

import (
	"net/http"
	"os"
	"time"

	"nazar_backend/helper"
	"nazar_backend/utils"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type AdminController struct {
	service AdminService
}

func NewAdminController(service AdminService) *AdminController {
	return &AdminController{
		service: service,
	}
}

// ===== LOGIN MANUAL =====
func (c *AdminController) Login(ctx *gin.Context) {
	var req LoginRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Username dan password wajib diisi",
		})
		return
	}

	admin, err := c.service.Login(req.Username, req.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	// ===== SET LOGIN_TYPE = "manual" UNTUK LOGIN MANUAL =====
	admin.LoginType = "manual"
	helper.DB.Model(&Admin{}).Where("id = ?", admin.ID).Update("login_type", "manual")

	// ===== GENERATE JWT TOKEN =====
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin_id": admin.ID,
		"username": admin.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "iwannabeyours123"
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal membuat token",
		})
		return
	}

	admin.Password = ""

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": LoginResponse{
			Token: tokenString,
			Admin: *admin,
		},
	})
}

// ===== LOGIN GOOGLE =====
func (c *AdminController) LoginGoogle(ctx *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
		Name  string `json:"name"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Email wajib diisi",
		})
		return
	}

	// Cari admin berdasarkan email
	admin, err := c.service.GetAdminByEmail(req.Email)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Admin tidak ditemukan",
		})
		return
	}

	// ===== SET LOGIN_TYPE = "google" =====
	admin.LoginType = "google"
	helper.DB.Model(&Admin{}).Where("id = ?", admin.ID).Update("login_type", "google")

	// ===== GENERATE JWT TOKEN =====
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"admin_id": admin.ID,
		"username": admin.Username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(),
	})

	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "iwannabeyours123"
	}

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal membuat token",
		})
		return
	}

	admin.Password = ""

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data": LoginResponse{
			Token: tokenString,
			Admin: *admin,
		},
	})
}

// ===== FORGOT PASSWORD =====
func (c *AdminController) ForgotPassword(ctx *gin.Context) {
	var req ForgotPasswordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Email tidak valid",
		})
		return
	}

	if !c.service.CheckEmailExists(req.Email) {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Email tidak terdaftar",
		})
		return
	}

	token, err := c.service.GenerateResetToken(req.Email)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	resetLink := "http://localhost:5174/admin/reset-password?token=" + token

	err = utils.SendResetEmail(req.Email, resetLink)
	if err != nil {
		// Tetap return success biar user ga tau email valid
		ctx.JSON(http.StatusOK, gin.H{
			"status":  "success",
			"message": "Link reset password telah dikirim ke email Anda",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Link reset password telah dikirim ke email Anda",
	})
}

// ===== RESET PASSWORD =====
func (c *AdminController) ResetPassword(ctx *gin.Context) {
	var req ResetPasswordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak lengkap (token & password baru harus diisi, min 6 karakter)",
		})
		return
	}

	// Verifikasi token dan dapatkan data admin
	admin, err := c.service.VerifyResetToken(req.Token)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	// Reset password
	err = c.service.ResetPassword(req.Token, req.NewPassword)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	// ===== SIMPAN RIWAYAT RESET PASSWORD =====
	riwayat := map[string]interface{}{
		"admin_id":   admin.ID,
		"admin_name": admin.Name,
		"aktivitas":  "Reset Password",
		"detail":     "Password berhasil direset melalui link forgot password",
		"created_at": time.Now(),
	}

	err = helper.DB.Table("riwayat_admins").Create(riwayat).Error
	if err != nil {
		// Log error tapi tetap return success
		// Jangan ganggu proses reset password
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Password berhasil direset, silakan login dengan password baru",
	})
}