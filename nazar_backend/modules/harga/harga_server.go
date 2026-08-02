package harga

import (
	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type HargaServer struct {
	router  *gin.RouterGroup
	version string
}

func NewHargaServer(router *gin.RouterGroup) *HargaServer {
	return &HargaServer{
		router:  router,
		version: "/v1.0",
	}
}

func (s *HargaServer) Init() {
	helper.DB.AutoMigrate(&Harga{})

	hargaService := NewHargaService()
	hargaController := NewHargaController(hargaService)

	hargaRouter := s.router.Group(s.version + "/harga")
	{
		hargaRouter.GET("", hargaController.GetAll)
		hargaRouter.PUT("/:jenis", hargaController.Update)
	}
}