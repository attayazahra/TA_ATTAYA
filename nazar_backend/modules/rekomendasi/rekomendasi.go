package rekomendasi

import (
	"time"
)

type AturanRekomendasi struct {
	ID               uint      `gorm:"primaryKey" json:"id"`
	Ruangan          string    `gorm:"size:50;not null" json:"ruangan"`
	Suasana          string    `gorm:"size:50;not null" json:"suasana"`
	WarnaRekomendasi string    `gorm:"type:text;not null" json:"warna_rekomendasi"`
	CreatedAt        time.Time `gorm:"autoCreateTime"`
	UpdatedAt        time.Time `gorm:"autoCreateTime"`
}