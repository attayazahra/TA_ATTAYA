package admin

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
	"time"

	"nazar_backend/helper"

	"golang.org/x/crypto/bcrypt"
)

// ===== UPDATE INTERFACE =====
type AdminService interface {
    Login(username, password string) (*Admin, error)
    GetAdminByEmail(email string) (*Admin, error) // ← TAMBAHKAN
    CheckEmailExists(email string) bool
    GenerateResetToken(email string) (string, error)
    VerifyResetToken(token string) (*Admin, error)
    ResetPassword(token, newPassword string) error
}

type adminService struct{}

func NewAdminService() AdminService {
	return &adminService{}
}

// ===== EXISTING: LOGIN (TIDAK DIUBAH) =====
func (s *adminService) Login(username, password string) (*Admin, error) {
	var admin Admin

	result := helper.DB.Where("username = ? OR email = ?", username, username).First(&admin) // UPDATE: bisa login pake email juga
	if result.Error != nil {
		return nil, errors.New("username atau password salah")
	}

	err := bcrypt.CompareHashAndPassword([]byte(admin.Password), []byte(password))
	if err != nil {
		return nil, errors.New("username atau password salah")
	}

	return &admin, nil
}

// ===== TAMBAHKAN METHOD BARU =====

// CheckEmailExists - cek apakah email terdaftar
func (s *adminService) CheckEmailExists(email string) bool {
	var count int64
	helper.DB.Model(&Admin{}).Where("email = ?", email).Count(&count)
	return count > 0
}

// GenerateResetToken - buat token reset password
func (s *adminService) GenerateResetToken(email string) (string, error) {
	var admin Admin
	err := helper.DB.Where("email = ?", email).First(&admin).Error
	if err != nil {
		return "", errors.New("email tidak terdaftar")
	}

	// Generate token 32 byte random
	tokenBytes := make([]byte, 32)
	_, err = rand.Read(tokenBytes)
	if err != nil {
		return "", errors.New("gagal generate token")
	}
	token := hex.EncodeToString(tokenBytes)

	// Expired 1 jam
	expiry := time.Now().Add(1 * time.Hour)

	// Update admin
	admin.ResetToken = token
	admin.TokenExpiry = &expiry
	err = helper.DB.Save(&admin).Error
	if err != nil {
		return "", errors.New("gagal simpan token")
	}

	return token, nil
}

// VerifyResetToken - verifikasi token reset password
func (s *adminService) VerifyResetToken(token string) (*Admin, error) {
	var admin Admin
	err := helper.DB.Where("reset_token = ?", token).First(&admin).Error
	if err != nil {
		return nil, errors.New("token tidak valid")
	}

	// Cek expired
	if admin.TokenExpiry == nil || time.Now().After(*admin.TokenExpiry) {
		return nil, errors.New("token sudah kadaluarsa")
	}

	return &admin, nil
}
// GetAdminByEmail - cari admin berdasarkan email
func (s *adminService) GetAdminByEmail(email string) (*Admin, error) {
    var admin Admin
    err := helper.DB.Where("email = ?", email).First(&admin).Error
    if err != nil {
        return nil, errors.New("admin tidak ditemukan")
    }
    return &admin, nil
}
// ResetPassword - reset password dengan token
func (s *adminService) ResetPassword(token, newPassword string) error {
	admin, err := s.VerifyResetToken(token)
	if err != nil {
		return err
	}

	// Hash password baru
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return errors.New("gagal hash password")
	}

	// Update password & clear token
	admin.Password = string(hashedPassword)
	admin.ResetToken = ""
	admin.TokenExpiry = nil

	err = helper.DB.Save(&admin).Error
	if err != nil {
		return errors.New("gagal update password")
	}

	return nil
}