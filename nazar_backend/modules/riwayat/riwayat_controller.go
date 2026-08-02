// FILE: modules/riwayat/riwayat_controller.go
package riwayat

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type RiwayatController struct {
	service RiwayatService
}

func NewRiwayatController(service RiwayatService) *RiwayatController {
	return &RiwayatController{
		service: service,
	}
}

// ============================================================
// 🔥 GENERATE KODE AKTIVITAS
// ============================================================
func generateKodeAktivitas(prefix string) string {
	now := time.Now()
	tanggal := now.Format("20060102")

	var count int64
	helper.DB.Table("riwayat_simulasis").Count(&count)

	nomor := fmt.Sprintf("%03d", count+1)

	return prefix + "/" + tanggal + "/" + nomor
}

// ============================================================
// 🔥 TAMBAH WARNA SIMULASI (POST tanpa foto)
// ============================================================
func (c *RiwayatController) TambahWarnaSimulasi(ctx *gin.Context) {
	var req struct {
		SessionID         string `json:"session_id"`
		WarnaDicoba       string `json:"warna_dicoba"`
		WarnaAkhir        string `json:"warna_akhir"`
		WarnaDibandingkan string `json:"warna_dibandingkan"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("❌ [TambahWarnaSimulasi] Binding error:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	log.Printf("📥 [TambahWarnaSimulasi] SessionID=%s, WarnaAkhir=%s, WarnaDicoba=%s",
		req.SessionID, req.WarnaAkhir, req.WarnaDicoba)

	kodeAktivitas := generateKodeAktivitas("SIM")

	data := &RiwayatSimulasi{
		SessionID:         req.SessionID,
		FotoPath:          "",
		WarnaDicoba:       req.WarnaDicoba,
		WarnaAkhir:        req.WarnaAkhir,
		WarnaDibandingkan: req.WarnaDibandingkan,
		KodeAktivitas:     kodeAktivitas,
	}

	if err := c.service.CreateSimulasi(data); err != nil {
		log.Println("❌ [TambahWarnaSimulasi] Service error:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan riwayat simulasi: " + err.Error(),
		})
		return
	}

	log.Printf("✅ [TambahWarnaSimulasi] Success! ID: %d, Kode: %s", data.ID, data.KodeAktivitas)

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   data,
	})
}

// ============================================================
// CREATE SIMULASI (POST dengan foto)
// ============================================================
func (c *RiwayatController) CreateSimulasi(ctx *gin.Context) {
	var req RiwayatSimulasiCreate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("❌ [CreateSimulasi] Binding error:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	log.Printf("📥 [CreateSimulasi] Request: SessionID=%s, FotoPath length=%d",
		req.SessionID, len(req.FotoPath))

	kodeAktivitas := generateKodeAktivitas("SIM")

	data := &RiwayatSimulasi{
		SessionID:     req.SessionID,
		FotoPath:      req.FotoPath,
		WarnaDicoba:   req.WarnaDicoba,
		WarnaAkhir:    req.WarnaAkhir,
		KodeAktivitas: kodeAktivitas,
	}

	if err := c.service.CreateSimulasi(data); err != nil {
		log.Println("❌ [CreateSimulasi] Service error:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan riwayat simulasi: " + err.Error(),
		})
		return
	}

	log.Printf("✅ [CreateSimulasi] Success! ID: %d, Kode: %s", data.ID, data.KodeAktivitas)

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   data,
	})
}

// ============================================================
// GET ALL
// ============================================================
func (c *RiwayatController) GetKalkulator(ctx *gin.Context) {
	data, err := c.service.GetKalkulator()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data riwayat kalkulator",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data,
	})
}

func (c *RiwayatController) GetSimulasi(ctx *gin.Context) {
	data, err := c.service.GetSimulasi()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data riwayat simulasi",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data,
	})
}

func (c *RiwayatController) GetRekomendasi(ctx *gin.Context) {
	data, err := c.service.GetRekomendasi()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data riwayat rekomendasi",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data,
	})
}

func (c *RiwayatController) GetAdmin(ctx *gin.Context) {
	data, err := c.service.GetAdmin()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengambil data riwayat admin",
		})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   data,
	})
}

// ============================================================
// CREATE LAINNYA
// ============================================================
func (c *RiwayatController) CreateAdmin(ctx *gin.Context) {
	var req RiwayatAdminCreate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	data := &RiwayatAdmin{
		AdminID:   req.AdminID,
		AdminName: req.AdminName,
		Aktivitas: req.Aktivitas,
		Detail:    req.Detail,
	}

	if err := c.service.CreateAdmin(data); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan riwayat admin",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   data,
	})
}

func (c *RiwayatController) CreateKalkulator(ctx *gin.Context) {
	var req RiwayatKalkulatorCreate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	kodeAktivitas := generateKodeAktivitas("KAL")

	data := &RiwayatKalkulator{
		SessionID:     req.SessionID,
		Panjang:       req.Panjang,
		Lebar:         req.Lebar,
		Tinggi:        req.Tinggi,
		JumlahPintu:   req.JumlahPintu,
		LebarPintu:    req.LebarPintu,
		TinggiPintu:   req.TinggiPintu,
		JumlahJendela: req.JumlahJendela,
		LebarJendela:  req.LebarJendela,
		TinggiJendela: req.TinggiJendela,
		Lapisan:       req.Lapisan,
		JenisCat:      req.JenisCat,
		KebutuhanKg:   req.KebutuhanKg,
		EstimasiBiaya: req.EstimasiBiaya,
		KodeAktivitas: kodeAktivitas,
	}

	if err := c.service.CreateKalkulator(data); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan riwayat kalkulator",
		})
		return
	}

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   data,
	})
}

// ============================================================
// 🔥 CREATE REKOMENDASI - DENGAN JENIS CAT (FINAL)
// ============================================================
func (c *RiwayatController) CreateRekomendasi(ctx *gin.Context) {
	var req struct {
		SessionID             string `json:"session_id"`
		JenisRuangan          string `json:"jenis_ruangan"`
		Suasana               string `json:"suasana"`
		WarnaDirekomendasikan string `json:"warna_direkomendasikan"`
		WarnaDipilih          string `json:"warna_dipilih"`
		JenisCatID            *uint  `json:"jenis_cat_id"`
		JenisCatNama          string `json:"jenis_cat_nama"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		log.Println("❌ [CreateRekomendasi] Binding error:", err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	log.Printf("📥 [CreateRekomendasi] SessionID=%s, Ruangan=%s, Suasana=%s, JenisCat=%s",
		req.SessionID, req.JenisRuangan, req.Suasana, req.JenisCatNama)

	kodeAktivitas := generateKodeAktivitas("REK")

	data := &RiwayatRekomendasi{
		SessionID:             req.SessionID,
		JenisRuangan:          req.JenisRuangan,
		Suasana:               req.Suasana,
		WarnaDirekomendasikan: req.WarnaDirekomendasikan,
		WarnaDipilih:          req.WarnaDipilih,
		JenisCatID:            req.JenisCatID,
		JenisCatNama:          req.JenisCatNama,
		KodeAktivitas:         kodeAktivitas,
	}

	if err := c.service.CreateRekomendasi(data); err != nil {
		log.Println("❌ [CreateRekomendasi] Service error:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal menyimpan riwayat rekomendasi: " + err.Error(),
		})
		return
	}

	log.Printf("✅ [CreateRekomendasi] Success! ID: %d, Kode: %s", data.ID, data.KodeAktivitas)

	ctx.JSON(http.StatusCreated, gin.H{
		"status": "success",
		"data":   data,
	})
}

// ============================================================
// UPDATE
// ============================================================
func (c *RiwayatController) UpdateSimulasi(ctx *gin.Context) {
	id, err := strconv.ParseUint(ctx.Param("id"), 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "ID tidak valid",
		})
		return
	}

	var req RiwayatSimulasiUpdate
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"message": "Data tidak valid: " + err.Error(),
		})
		return
	}

	existing, err := c.service.GetSimulasiByID(uint(id))
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"message": "Riwayat tidak ditemukan",
		})
		return
	}

	existing.WarnaDicoba = req.WarnaDicoba
	existing.WarnaDibandingkan = req.WarnaDibandingkan
	existing.WarnaAkhir = req.WarnaAkhir

	if err := c.service.UpdateSimulasi(existing); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal mengupdate riwayat simulasi",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   existing,
	})
}