package harga

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HargaController struct {
	service HargaService
}

func NewHargaController(service HargaService) *HargaController {
	return &HargaController{
		service: service,
	}
}

// GET /api/v1.0/harga
func (c *HargaController) GetAll(ctx *gin.Context) {
	hargaList, err := c.service.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data harga",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   hargaList,
	})
}

// PUT /api/v1.0/harga/:jenis
func (c *HargaController) Update(ctx *gin.Context) {
	jenis := ctx.Param("jenis")

	// 🔧 PERBAIKAN: pakai harga_per_kg (sesuai dengan model)
	var req struct {
		HargaPerKg int `json:"harga_per_kg" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Harga wajib diisi",
		})
		return
	}

	if req.HargaPerKg < 0 {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Harga tidak boleh negatif",
		})
		return
	}

	harga, err := c.service.Update(jenis, req.HargaPerKg)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Jenis cat tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   harga,
	})
}