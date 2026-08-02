package harga

import (
	"nazar_backend/helper"

	"gorm.io/gorm"
)

type HargaService interface {
	GetAll() ([]Harga, error)
	Update(jenis string, harga int) (*Harga, error)
}

type hargaService struct {
	db *gorm.DB
}

func NewHargaService() HargaService {
	return &hargaService{
		db: helper.DB,
	}
}

func (s *hargaService) GetAll() ([]Harga, error) {
	var hargaList []Harga
	err := s.db.Find(&hargaList).Error
	return hargaList, err
}

func (s *hargaService) Update(jenis string, harga int) (*Harga, error) {
	var h Harga
	err := s.db.Where("jenis = ?", jenis).First(&h).Error
	if err != nil {
		return nil, err
	}

	h.HargaPerKg = harga
	err = s.db.Save(&h).Error
	return &h, err
}