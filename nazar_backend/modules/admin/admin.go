package admin

import (
	"time"
)

type Admin struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Username    string    `gorm:"size:50;not null;unique" json:"username"`
	Password    string    `gorm:"size:255;not null" json:"-"`
	Name        string    `gorm:"size:100" json:"name"`
	Email       string    `gorm:"size:100;uniqueIndex" json:"email"` 
	Picture     string    `gorm:"type:text" json:"picture"`
	LoginType   string    `gorm:"size:20;default:manual" json:"login_type"`
	ResetToken  string     `gorm:"size:255;index" json:"-"`
	TokenExpiry *time.Time `gorm:"index" json:"-"`
	CreatedAt   time.Time `gorm:"autoCreateTime"`
	UpdatedAt   time.Time `gorm:"autoCreateTime"`
}

// Request & Response existing
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
	Admin Admin  `json:"admin"`
}

// ===== TAMBAHKAN REQUEST/RESPONSE BARU =====
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=6"`
}

type ResetPasswordResponse struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}