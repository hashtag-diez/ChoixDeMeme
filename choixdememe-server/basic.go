package main

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

func getDuelIDFromRequest(req *http.Request) int {
	duelIDStr := req.URL.Query().Get("duel_id")
	duelID, err := strconv.Atoi(duelIDStr)
	if err != nil {
		return 0
	}
	return duelID
}

func getUserIDFromRequest(req *http.Request, db *gorm.DB) (int, error) {
	authHeader := req.Header.Get("Authorization")
	if authHeader == "" {
		return 0, errors.New("missing authorization header")
	}

	authToken := strings.TrimPrefix(authHeader, "Bearer ")
	var token Token
	err := db.Table("tokens").Where("value = ?", authToken).First(&token).Error
	if err != nil {
		return 0, err
	}

	return token.UserID, nil
}

func resetDatabase(db *gorm.DB) {
    // Truncate all tables
    err := db.Exec("DELETE FROM duels; DELETE FROM votes; DELETE FROM comments; DELETE FROM users; DELETE FROM tokens").Error
    if err != nil {
        panic(err)
    }

    // Reset auto increment values
    err = db.Exec("DELETE FROM sqlite_sequence WHERE name IN ('duels', 'votes', 'comments', 'users', 'tokens')").Error
    if err != nil {
        panic(err)
    }
}


