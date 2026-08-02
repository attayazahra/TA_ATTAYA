package main

import (
	"log"
	"nazar_backend/helper"
	"nazar_backend/modules/admin"
	"nazar_backend/modules/harga"
	"nazar_backend/modules/rekomendasi"
	"nazar_backend/modules/riwayat"
	"nazar_backend/modules/session"
	"nazar_backend/modules/warna"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env not found, using default")
	}

	helper.ConnectDB()
	fixCreatedAt()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true // Allow all origins dynamically
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := r.Group("/api")

	admin.NewAdminServer(api).Init()
	warna.NewWarnaServer(api).Init()
	harga.NewHargaServer(api).Init()
	rekomendasi.NewRekomendasiServer(api).Init()
	riwayat.NewRiwayatServer(api).Init()
	session.NewSessionServer(api).Init()

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

	log.Printf("Server running on http://localhost:%s", port)
	log.Printf("API base path: /api/v1.0")

	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func fixCreatedAt() {
	db := helper.GetDB()
	if db == nil {
		log.Println("Database not connected, skip fix created_at")
		return
	}

	log.Println("Checking and fixing created_at...")

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
			db.Exec("UPDATE "+table+" SET created_at = NOW() WHERE created_at IS NULL")
			db.Exec("UPDATE "+table+" SET updated_at = NOW() WHERE updated_at IS NULL")
			log.Printf("%s: %d rows updated", table, count)
		}
	}

	log.Println("Created_at fix completed")
}