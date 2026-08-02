// FILE: modules/riwayat/riwayat_service.go
package riwayat

import (
	"nazar_backend/helper"
)

type RiwayatService struct{}

func NewRiwayatService() RiwayatService {
	return RiwayatService{}
}

// ===== KALKULATOR =====
func (s RiwayatService) CreateKalkulator(data *RiwayatKalkulator) error {
	return helper.DB.Create(data).Error
}

func (s RiwayatService) GetKalkulator() ([]RiwayatKalkulator, error) {
	var data []RiwayatKalkulator
	err := helper.DB.Order("created_at DESC").Find(&data).Error
	return data, err
}

// ===== SIMULASI =====
func (s RiwayatService) CreateSimulasi(data *RiwayatSimulasi) error {
	return helper.DB.Create(data).Error
}

func (s RiwayatService) GetSimulasi() ([]RiwayatSimulasi, error) {
	var data []RiwayatSimulasi
	err := helper.DB.Order("created_at DESC").Find(&data).Error
	return data, err
}

func (s RiwayatService) GetSimulasiByID(id uint) (*RiwayatSimulasi, error) {
	var data RiwayatSimulasi
	err := helper.DB.First(&data, id).Error
	return &data, err
}

func (s RiwayatService) UpdateSimulasi(data *RiwayatSimulasi) error {
	return helper.DB.Save(data).Error
}

// ===== REKOMENDASI =====
func (s RiwayatService) CreateRekomendasi(data *RiwayatRekomendasi) error {
	return helper.DB.Create(data).Error
}

func (s RiwayatService) GetRekomendasi() ([]RiwayatRekomendasi, error) {
	var data []RiwayatRekomendasi
	err := helper.DB.Order("created_at DESC").Find(&data).Error
	return data, err
}

// ===== ADMIN =====
func (s RiwayatService) CreateAdmin(data *RiwayatAdmin) error {
	return helper.DB.Create(data).Error
}

func (s RiwayatService) GetAdmin() ([]RiwayatAdmin, error) {
	var data []RiwayatAdmin
	err := helper.DB.Order("created_at DESC").Find(&data).Error
	return data, err
}