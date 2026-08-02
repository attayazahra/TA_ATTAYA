package rekomendasi

import (
	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type RekomendasiServer struct {
	router  *gin.RouterGroup
	version string
}

func NewRekomendasiServer(router *gin.RouterGroup) *RekomendasiServer {
	return &RekomendasiServer{
		router:  router,
		version: "/v1.0",
	}
}

func (s *RekomendasiServer) Init() {
	// Auto migrate (buat tabel kalau belum ada)
	helper.DB.AutoMigrate(&AturanRekomendasi{})

	// Service dan Controller
	rekomendasiService := NewRekomendasiService()
	rekomendasiController := NewRekomendasiController(rekomendasiService)

	// Routes
	rekomendasiRouter := s.router.Group(s.version + "/rekomendasi/aturan")
	{
		rekomendasiRouter.GET("", rekomendasiController.GetAll)
		rekomendasiRouter.GET("/:ruangan/:suasana", rekomendasiController.GetByRuanganSuasana)
		rekomendasiRouter.POST("", rekomendasiController.CreateOrUpdate)
		rekomendasiRouter.DELETE("/:ruangan/:suasana", rekomendasiController.Delete)
	}
}