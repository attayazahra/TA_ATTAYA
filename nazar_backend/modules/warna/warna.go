package warna

import "time"

type Warna struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	NomorSeri  string    `gorm:"column:nomor_seri;size:50" json:"nomor_seri"`  
	Nama       string    `gorm:"size:100" json:"nama"`
	KodeHex    string    `gorm:"column:kode_hex;size:7" json:"kode_hex"`        
	Kategori   string    `gorm:"size:50" json:"kategori"`
	Tersedia   bool      `json:"tersedia"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoCreateTime"`
}