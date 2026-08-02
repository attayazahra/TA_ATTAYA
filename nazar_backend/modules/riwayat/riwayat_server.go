// FILE: modules/riwayat/riwayat_server.go
package riwayat

import (
	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type RiwayatServer struct {
	router  *gin.RouterGroup
	version string
}

func NewRiwayatServer(router *gin.RouterGroup) *RiwayatServer {
	return &RiwayatServer{
		router:  router,
		version: "/v1.0",
	}
}

func (s *RiwayatServer) Init() {
	// Auto migrate semua tabel riwayat
	helper.DB.AutoMigrate(
		&RiwayatKalkulator{},
		&RiwayatSimulasi{},
		&RiwayatRekomendasi{},
		&RiwayatAdmin{},
	)

	// 🔥 Ubah kolom menjadi TEXT (biar kompatibel)
	helper.DB.Exec("ALTER TABLE riwayat_simulasis ALTER COLUMN warna_dicoba TYPE TEXT USING warna_dicoba::TEXT")
	helper.DB.Exec("ALTER TABLE riwayat_simulasis ALTER COLUMN warna_dibandingkan TYPE TEXT USING warna_dibandingkan::TEXT")

	service := NewRiwayatService()
	controller := NewRiwayatController(service)

	router := s.router.Group(s.version + "/riwayat")
	{
		// ===== GET =====
		router.GET("/kalkulator", controller.GetKalkulator)
		router.GET("/simulasi", controller.GetSimulasi)
		router.GET("/rekomendasi", controller.GetRekomendasi)
		router.GET("/admin", controller.GetAdmin)

		// ===== POST =====
		router.POST("/admin", controller.CreateAdmin)
		router.POST("/kalkulator", controller.CreateKalkulator)
		router.POST("/simulasi", controller.CreateSimulasi)
		router.POST("/rekomendasi", controller.CreateRekomendasi)

		// 🔥 TAMBAHKAN: POST untuk tambah warna (tanpa foto)
		router.POST("/simulasi/warna", controller.TambahWarnaSimulasi)

		// ===== PUT =====
		router.PUT("/simulasi/:id", controller.UpdateSimulasi)
	}
}