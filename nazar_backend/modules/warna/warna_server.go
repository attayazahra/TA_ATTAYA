package warna

import (
	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type WarnaServer struct {
	router  *gin.RouterGroup
	version string
}

func NewWarnaServer(router *gin.RouterGroup) *WarnaServer {
	return &WarnaServer{
		router:  router,
		version: "/v1.0",
	}
}

func (s *WarnaServer) Init() {
	helper.DB.AutoMigrate(&Warna{})

	warnaService := NewWarnaService()
	warnaController := NewWarnaController(warnaService)

	warnaRouter := s.router.Group(s.version + "/warna")
	{
		warnaRouter.GET("", warnaController.GetAll)
		warnaRouter.GET("/:id", warnaController.GetByID)
		warnaRouter.POST("", warnaController.Create)
		warnaRouter.PUT("/:id", warnaController.Update)
		warnaRouter.DELETE("/:id", warnaController.Delete)
	}
}