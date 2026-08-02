package helper

import (
	"fmt"
	"time"
)

// GenerateNomorAntrian menghasilkan nomor antrian dengan format:
// ANT/YYYYMMDD/XXX
// Contoh: ANT/20260703/001
func GenerateNomorAntrian() string {
	now := time.Now()
	tanggal := now.Format("20060102") // YYYYMMDD
	
	// Ambil counter dari database (nanti diisi)
	// Untuk sementara pakai timestamp millisecond
	millis := now.UnixMilli() % 1000
	return fmt.Sprintf("ANT/%s/%03d", tanggal, millis)
}

// GenerateNomorAntrianWithCounter dengan counter dari database
func GenerateNomorAntrianWithCounter(counter int) string {
	now := time.Now()
	tanggal := now.Format("20060102")
	return fmt.Sprintf("ANT/%s/%03d", tanggal, counter)
}