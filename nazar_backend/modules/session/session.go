package session

import (
	"time"
)

type Session struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	SessionID string    `gorm:"size:20;not null;unique" json:"session_id"`
	CreatedAt time.Time `gorm:"autoCreateTime"`
}