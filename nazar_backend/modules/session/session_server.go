package session

import (
	"nazar_backend/helper"

	"github.com/gin-gonic/gin"
)

type SessionServer struct {
	router  *gin.RouterGroup
	version string
}

func NewSessionServer(router *gin.RouterGroup) *SessionServer {
	return &SessionServer{
		router:  router,
		version: "/v1.0",
	}
}

func (s *SessionServer) Init() {
	helper.DB.AutoMigrate(&Session{})

	service := NewSessionService()
	controller := NewSessionController(service)

	sessionRouter := s.router.Group(s.version + "/session")
	{
		sessionRouter.GET("", controller.CreateOrGet)
	}
}