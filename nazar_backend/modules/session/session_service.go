package session

import (
	"fmt"
	"math/rand"
	"nazar_backend/helper"
	"gorm.io/gorm"
)

type SessionService interface {
	CreateSession() (*Session, error)
	GetSession(sessionID string) (*Session, error)
}

type sessionService struct {
	db *gorm.DB
}

func NewSessionService() SessionService {
	return &sessionService{
		db: helper.DB,
	}
}

func (s *sessionService) CreateSession() (*Session, error) {
	// Generate session ID unik
	var sessionID string
	for {
		// Format: S-XXXXXX (6 digit random)
		randomNum := 100000 + rand.Intn(900000)
		sessionID = fmt.Sprintf("S-%d", randomNum)

		// Cek apakah sudah ada
		var existing Session
		err := s.db.Where("session_id = ?", sessionID).First(&existing).Error
		if err != nil {
			break // Session ID unik
		}
	}

	session := &Session{
		SessionID: sessionID,
	}

	err := s.db.Create(session).Error
	return session, err
}

func (s *sessionService) GetSession(sessionID string) (*Session, error) {
	var session Session
	err := s.db.Where("session_id = ?", sessionID).First(&session).Error
	return &session, err
}