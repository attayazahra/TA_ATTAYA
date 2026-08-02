// FILE: modules/riwayat/riwayat.go
package riwayat

import "time"

// ============================================================
// RIWAYAT KALKULATOR
// ============================================================
type RiwayatKalkulator struct {
	ID            uint      `json:"id" gorm:"primaryKey"`
	SessionID     string    `json:"session_id"`
	Panjang       float64   `json:"panjang"`
	Lebar         float64   `json:"lebar"`
	Tinggi        float64   `json:"tinggi"`
	JumlahPintu   int       `json:"jumlah_pintu"`
	LebarPintu    float64   `json:"lebar_pintu"`
	TinggiPintu   float64   `json:"tinggi_pintu"`
	JumlahJendela int       `json:"jumlah_jendela"`
	LebarJendela  float64   `json:"lebar_jendela"`
	TinggiJendela float64   `json:"tinggi_jendela"`
	Lapisan       int       `json:"lapisan"`
	JenisCat      string    `json:"jenis_cat"`
	KebutuhanKg   float64   `json:"kebutuhan_kg"`
	EstimasiBiaya float64   `json:"estimasi_biaya"`
	KodeAktivitas string    `json:"kode_aktivitas"`
	CreatedAt     time.Time `json:"created_at"`
}

func (RiwayatKalkulator) TableName() string {
	return "riwayat_kalkulators"
}

// ============================================================
// RIWAYAT SIMULASI
// ============================================================
type RiwayatSimulasi struct {
	ID                uint      `json:"id" gorm:"primaryKey"`
	SessionID         string    `json:"session_id"`
	FotoPath          string    `json:"foto_path"`
	WarnaDicoba       string    `json:"warna_dicoba" gorm:"type:text"`
	WarnaAkhir        string    `json:"warna_akhir"`
	WarnaDibandingkan string    `json:"warna_dibandingkan" gorm:"type:text"`
	KodeAktivitas     string    `json:"kode_aktivitas"`
	CreatedAt         time.Time `json:"created_at"`
}

func (RiwayatSimulasi) TableName() string {
	return "riwayat_simulasis"
}

// ============================================================
// RIWAYAT REKOMENDASI
// ============================================================
type RiwayatRekomendasi struct {
	ID                    uint      `json:"id" gorm:"primaryKey"`
	SessionID             string    `json:"session_id"`
	JenisRuangan          string    `json:"jenis_ruangan"`
	Suasana               string    `json:"suasana"`
	WarnaDirekomendasikan string    `json:"warna_direkomendasikan" gorm:"type:text"`
	WarnaDipilih          string    `json:"warna_dipilih" gorm:"type:text"`
	JenisCatID            *uint     `json:"jenis_cat_id"`         // TAMBAHKAN
	JenisCatNama          string    `json:"jenis_cat_nama"`       // TAMBAHKAN
	KodeAktivitas         string    `json:"kode_aktivitas"`
	CreatedAt             time.Time `json:"created_at"`
}

func (RiwayatRekomendasi) TableName() string {
	return "riwayat_rekomendasis"
}

// ============================================================
// RIWAYAT ADMIN
// ============================================================
type RiwayatAdmin struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	AdminID   int       `json:"admin_id"`
	AdminName string    `json:"admin_name"`
	Aktivitas string    `json:"aktivitas"`
	Detail    string    `json:"detail"`
	CreatedAt time.Time `json:"created_at"`
}

func (RiwayatAdmin) TableName() string {
	return "riwayat_admins"
}

// ============================================================
// DTO (Data Transfer Object)
// ============================================================
type RiwayatSimulasiCreate struct {
	SessionID   string `json:"session_id"`
	FotoPath    string `json:"foto_path"`
	WarnaDicoba string `json:"warna_dicoba"`
	WarnaAkhir  string `json:"warna_akhir"`
}

type RiwayatSimulasiUpdate struct {
	WarnaDicoba       string `json:"warna_dicoba"`
	WarnaAkhir        string `json:"warna_akhir"`
	WarnaDibandingkan string `json:"warna_dibandingkan"`
}

type RiwayatKalkulatorCreate struct {
	SessionID     string  `json:"session_id"`
	Panjang       float64 `json:"panjang"`
	Lebar         float64 `json:"lebar"`
	Tinggi        float64 `json:"tinggi"`
	JumlahPintu   int     `json:"jumlah_pintu"`
	LebarPintu    float64 `json:"lebar_pintu"`
	TinggiPintu   float64 `json:"tinggi_pintu"`
	JumlahJendela int     `json:"jumlah_jendela"`
	LebarJendela  float64 `json:"lebar_jendela"`
	TinggiJendela float64 `json:"tinggi_jendela"`
	Lapisan       int     `json:"lapisan"`
	JenisCat      string  `json:"jenis_cat"`
	KebutuhanKg   float64 `json:"kebutuhan_kg"`
	EstimasiBiaya float64 `json:"estimasi_biaya"`
}

type RiwayatRekomendasiCreate struct {
	SessionID             string `json:"session_id"`
	JenisRuangan          string `json:"jenis_ruangan"`
	Suasana               string `json:"suasana"`
	WarnaDirekomendasikan string `json:"warna_direkomendasikan"`
	WarnaDipilih          string `json:"warna_dipilih"`
	JenisCatID            *uint  `json:"jenis_cat_id"`    // TAMBAHKAN
	JenisCatNama          string `json:"jenis_cat_nama"`  // TAMBAHKAN
}

type RiwayatAdminCreate struct {
	AdminID   int    `json:"admin_id"`
	AdminName string `json:"admin_name"`
	Aktivitas string `json:"aktivitas"`
	Detail    string `json:"detail"`
}