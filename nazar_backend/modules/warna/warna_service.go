package warna

import (
	"nazar_backend/helper"

	"gorm.io/gorm"
)

type WarnaService interface {
	GetAll() ([]Warna, error)
	GetByID(id uint) (*Warna, error)
	Create(warna *Warna) error
	Update(warna *Warna) error
	Delete(id uint) error
}

type warnaService struct {
	db *gorm.DB
}

func NewWarnaService() WarnaService {
	return &warnaService{
		db: helper.DB,
	}
}

func (s *warnaService) GetAll() ([]Warna, error) {
	var warnaList []Warna
	err := s.db.Order("id ASC").Find(&warnaList).Error
	return warnaList, err
}

func (s *warnaService) GetByID(id uint) (*Warna, error) {
	var warna Warna
	err := s.db.First(&warna, id).Error
	return &warna, err
}

func (s *warnaService) Create(warna *Warna) error {
	return s.db.Create(warna).Error
}

func (s *warnaService) Update(warna *Warna) error {
	return s.db.Save(warna).Error
}

func (s *warnaService) Delete(id uint) error {
	return s.db.Delete(&Warna{}, id).Error
}