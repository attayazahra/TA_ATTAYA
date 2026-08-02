package harga

import (
	"time"
)

type Harga struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	Jenis      string    `gorm:"size:50;not null;unique" json:"jenis"`
	HargaPerKg int       `gorm:"column:harga_per_kg" json:"harga_per_kg"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	UpdatedAt  time.Time `gorm:"autoCreateTime"`
}