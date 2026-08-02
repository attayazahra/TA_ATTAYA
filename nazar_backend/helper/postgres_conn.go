
package helper

import (
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// ConnectDB - Inisialisasi koneksi database
func ConnectDB() {
	// Ambil dari environment variable
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Fallback ke default (sesuai dengan database kamu)
	if host == "" {
		host = "localhost"
	}
	if user == "" {
		user = "postgres"
	}
	if password == "" {
		password = "postgres"
	}
	if dbname == "" {
		dbname = "nazar_paintweb" // Nama database kamu
	}
	if port == "" {
		port = "5433" // Port PostgreSQL kamu
	}

	// Buat DSN (Data Source Name)
	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta",
		host, user, password, dbname, port,
	)

	// Koneksi ke database
	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("❌ Gagal koneksi ke database:", err)
	}

	log.Println("✅ Koneksi database berhasil!")
	log.Printf("📊 Host: %s:%s, Database: %s", host, port, dbname)
}

// GetDB - Return DB instance (opsional)
func GetDB() *gorm.DB {
	return DB
}