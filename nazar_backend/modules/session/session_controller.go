package session

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type SessionController struct {
	service SessionService
}

func NewSessionController(service SessionService) *SessionController {
	return &SessionController{
		service: service,
	}
}

// GET /api/v1.0/session
func (c *SessionController) CreateOrGet(ctx *gin.Context) {
	// Cek apakah ada session_id di header
	sessionID := ctx.GetHeader("X-Session-ID")

	if sessionID != "" {
		// Cek apakah session valid
		session, err := c.service.GetSession(sessionID)
		if err == nil {
			ctx.JSON(http.StatusOK, gin.H{
				"status": "success",
				"data":   session,
			})
			return
		}
	}

	// Buat session baru
	session, err := c.service.CreateSession()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"message": "Gagal membuat session",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"status": "success",
		"data":   session,
	})
}