package rekomendasi

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type RekomendasiController struct {
	service RekomendasiService
}

func NewRekomendasiController(service RekomendasiService) *RekomendasiController {
	return &RekomendasiController{
		service: service,
	}
}

// GET /api/v1.0/rekomendasi/aturan
func (c *RekomendasiController) GetAll(ctx *gin.Context) {
	aturanList, err := c.service.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data aturan rekomendasi",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   aturanList,
	})
}

// GET /api/v1.0/rekomendasi/aturan/:ruangan/:suasana
func (c *RekomendasiController) GetByRuanganSuasana(ctx *gin.Context) {
	ruangan := ctx.Param("ruangan")
	suasana := ctx.Param("suasana")

	aturan, err := c.service.GetByRuanganSuasana(ruangan, suasana)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Aturan tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   aturan,
	})
}

// POST /api/v1.0/rekomendasi/aturan
func (c *RekomendasiController) CreateOrUpdate(ctx *gin.Context) {
	var req struct {
		Ruangan          string `json:"ruangan" binding:"required"`
		Suasana          string `json:"suasana" binding:"required"`
		WarnaRekomendasi string `json:"warna_rekomendasi" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	aturan := &AturanRekomendasi{
		Ruangan:          req.Ruangan,
		Suasana:          req.Suasana,
		WarnaRekomendasi: req.WarnaRekomendasi,
	}

	if err := c.service.CreateOrUpdate(aturan); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan aturan rekomendasi: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   aturan,
	})
}

// DELETE /api/v1.0/rekomendasi/aturan/:ruangan/:suasana
func (c *RekomendasiController) Delete(ctx *gin.Context) {
	ruangan := ctx.Param("ruangan")
	suasana := ctx.Param("suasana")

	if err := c.service.Delete(ruangan, suasana); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Aturan rekomendasi berhasil dihapus",
	})
}