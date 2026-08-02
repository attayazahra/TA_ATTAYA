package admin

import (
    "nazar_backend/helper"
    "github.com/gin-gonic/gin"
)

type AdminServer struct {
    router  *gin.RouterGroup
    version string
}

func NewAdminServer(router *gin.RouterGroup) *AdminServer {
    return &AdminServer{
        router:  router,
        version: "/v1.0",
    }
}

func (s *AdminServer) Init() {
    helper.DB.AutoMigrate(&Admin{})

    adminService := NewAdminService()
    adminController := NewAdminController(adminService)

    adminRouter := s.router.Group(s.version + "/admin")
    {
        adminRouter.POST("/login", adminController.Login)
        adminRouter.POST("/forgot-password", adminController.ForgotPassword)  
        adminRouter.POST("/reset-password", adminController.ResetPassword) 
		adminRouter.POST("/login-google", adminController.LoginGoogle)
    }
}   
    
