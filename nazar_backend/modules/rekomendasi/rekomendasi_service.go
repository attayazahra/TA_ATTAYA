package rekomendasi

import (
	"errors"
	"nazar_backend/helper"

	"gorm.io/gorm"
)

type RekomendasiService interface {
	GetAll() ([]AturanRekomendasi, error)
	GetByRuanganSuasana(ruangan, suasana string) (*AturanRekomendasi, error)
	CreateOrUpdate(aturan *AturanRekomendasi) error
	Delete(ruangan, suasana string) error
}

type rekomendasiService struct {
	db *gorm.DB
}

func NewRekomendasiService() RekomendasiService {
	return &rekomendasiService{
		db: helper.DB,
	}
}

func (s *rekomendasiService) GetAll() ([]AturanRekomendasi, error) {
	var aturanList []AturanRekomendasi
	err := s.db.Find(&aturanList).Error
	return aturanList, err
}

func (s *rekomendasiService) GetByRuanganSuasana(ruangan, suasana string) (*AturanRekomendasi, error) {
	var aturan AturanRekomendasi
	err := s.db.Where("ruangan = ? AND suasana = ?", ruangan, suasana).First(&aturan).Error
	if err != nil {
		return nil, errors.New("aturan tidak ditemukan")
	}
	return &aturan, nil
}

func (s *rekomendasiService) CreateOrUpdate(aturan *AturanRekomendasi) error {
	// Cek apakah sudah ada
	var existing AturanRekomendasi
	err := s.db.Where("ruangan = ? AND suasana = ?", aturan.Ruangan, aturan.Suasana).First(&existing).Error

	if err == nil {
		// Update existing
		existing.WarnaRekomendasi = aturan.WarnaRekomendasi
		return s.db.Save(&existing).Error
	}

	// Create new
	return s.db.Create(aturan).Error
}

func (s *rekomendasiService) Delete(ruangan, suasana string) error {
	result := s.db.Where("ruangan = ? AND suasana = ?", ruangan, suasana).Delete(&AturanRekomendasi{})
	if result.RowsAffected == 0 {
		return errors.New("aturan tidak ditemukan")
	}
	return result.Error
}