package main

import (
	"crypto/rand"
	"encoding/base64"

	"gorm.io/gorm"
)

const tokenSize = 32

type Token struct {
	UserID int
	Value  string
}

func generateToken(userID int, db *gorm.DB) (*Token, error) {
	// generer random token
	b := make([]byte, tokenSize)
	_, err := rand.Read(b)
	if err != nil {
		return nil, err
	}

	// transfrer to string
	token := &Token{
		Value:  base64.URLEncoding.EncodeToString(b),
		UserID: userID,
	}

	// save to bsd
	if err := db.Table("tokens").Create(token).Error; err != nil {
		return nil, err
	}

	return token, nil
}

func deleteToken(tok int, db *gorm.DB) {
	token := &Token{}
	db.Table("tokens").Where("user_id = ?", tok).Delete(&token)
}
