package main

import (
	"crypto/rand"
	"encoding/base64"

	"gorm.io/gorm"
)

const tokenSize = 32 

type Token struct {
    Value    string
    UserID   int
}

func generateToken(userID int , db *gorm.DB) (*Token, error) {
    // generer random token
    b := make([]byte, tokenSize)
    _, err := rand.Read(b)
    if err != nil {
        return nil, err
    }

    // transfrer to string
    token := &Token{
        Value:    base64.URLEncoding.EncodeToString(b),
        UserID:   userID,
    }

    // save to bsd
    if err := db.Table("tokens").Create(token).Error; err != nil {
        return nil, err
    }

    return token, nil
}
