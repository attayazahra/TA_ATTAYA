package main

import (
	"log"
	"os"
	"strings"
	"time"

	"nazar_backend/helper"
	"nazar_backend/modules/admin"
	"nazar_backend/modules/harga"
	"nazar_backend/modules/rekomendasi"
	"nazar_backend/modules/riwayat"
	"nazar_backend/modules/session"
	"nazar_backend/modules/warna"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found, falling back to system environment variables")
	}

	// Atur Mode Gin ke Release jika di Production
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	helper.ConnectDB()
	fixCreatedAt()

	r := gin.Default()

	// List domain yang diizinkan melakukan request ke backend
	frontendURL := os.Getenv("FRONTEND_URL")
	allowedOrigins := []string{
		"http://localhost:5174",
		"http://localhost:3000",
		"https://nazar-paintweb.ryaze.my.id",
	}

	if frontendURL != "" {
		allowedOrigins = append(allowedOrigins, frontendURL)
	}

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			// Mengizinkan request dari origin yang terdaftar atau localhost/IP lokal saat development
			for _, allowed := range allowedOrigins {
				if origin == allowed || strings.HasPrefix(origin, "http://192.168.") {
					return true
				}
			}
			return false
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Grouping Router API
	api := r.Group("/api")

	admin.NewAdminServer(api).Init()
	warna.NewWarnaServer(api).Init()
	harga.NewHargaServer(api).Init()
	rekomendasi.NewRekomendasiServer(api).Init()
	riwayat.NewRiwayatServer(api).Init()
	session.NewSessionServer(api).Init()

	// Health Check Endpoints
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Backend Nazar Paint is running",
			"status":  "healthy",
		})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8081"
	}

	log.Printf("Server listening on port :%s", port)
	log.Printf("API base path: /api/v1.0")

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server: ", err)
	}
}

func fixCreatedAt() {
	db := helper.GetDB()
	if db == nil {
		log.Println("Database connection is nil, skipping created_at migration fix")
		return
	}

	log.Println("Checking and fixing created_at / updated_at timestamps...")

	tables := []string{
		"admins",
		"sessions",
		"warnas",
		"hargas",
		"aturan_rekomendasis",
		"riwayat_kalkulators",
		"riwayat_simulasis",
		"riwayat_rekomendasis",
		"riwayat_admins",
	}

	for _, table := range tables {
		var count int64
		db.Table(table).Where("created_at IS NULL").Count(&count)

		if count > 0 {
			db.Exec("UPDATE " + table + " SET created_at = NOW() WHERE created_at IS NULL")
			db.Exec("UPDATE " + table + " SET updated_at = NOW() WHERE updated_at IS NULL")
			log.Printf("Table %s: updated %d rows", table, count)
		}
	}

	log.Println("Timestamp verification completed")
}