package warna

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type WarnaController struct {
	service WarnaService
}

func NewWarnaController(service WarnaService) *WarnaController {
	return &WarnaController{
		service: service,
	}
}

// GET /api/v1.0/warna
func (c *WarnaController) GetAll(ctx *gin.Context) {
	warnaList, err := c.service.GetAll()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data warna",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   warnaList,
	})
}

// GET /api/v1.0/warna/:id
func (c *WarnaController) GetByID(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "ID tidak valid",
		})
		return
	}

	warna, err := c.service.GetByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Warna tidak ditemukan",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   warna,
	})
}

// POST /api/v1.0/warna
func (c *WarnaController) Create(ctx *gin.Context) {
	var warna Warna
	if err := ctx.ShouldBindJSON(&warna); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	if err := c.service.Create(&warna); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menambah warna: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   warna,
	})
}

// PUT /api/v1.0/warna/:id
func (c *WarnaController) Update(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "ID tidak valid",
		})
		return
	}

	var warna Warna
	if err := ctx.ShouldBindJSON(&warna); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	warna.ID = uint(id)
	if err := c.service.Update(&warna); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengupdate warna: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   warna,
	})
}

// DELETE /api/v1.0/warna/:id
func (c *WarnaController) Delete(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "ID tidak valid",
		})
		return
	}

	if err := c.service.Delete(uint(id)); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menghapus warna: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Warna berhasil dihapus",
	})
}