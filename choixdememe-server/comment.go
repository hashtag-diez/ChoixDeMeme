package main

import (
	"encoding/json"
	"net/http"
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	Comment   string    `json:"comment"`
	UserID    int       `json:"user_id"`
	DuelID    int       `json:"duel_id"`
	CreatedAt time.Time `json:"created_at"`
}
type ResponseComment struct {
	Comment   string `json:"comment"`
	UserID    int    `json:"user_id"`
	DuelID    int    `json:"duel_id"`
	CreatedAt string `json:"created_at"`
	Username  string `json:"username"`
}

func commentaireHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {

		// get the ID of duel
		duelID := getDuelIDFromRequest(req)

		if req.Method == "GET" {
			// get all comments for the duel
			var comments []ResponseComment
			db.Table("comments").
				Select("comments.*, users.username").
				Joins("left join users on users.id = comments.user_id").
				Where("comments.duel_id = ?", duelID).
				Order("created_at DESC").
				Scan(&comments)

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(comments)

		} else if req.Method == "POST" {
			// check token
			userID, err := getUserIDFromRequest(req, db)
			if err != nil {
				http.Error(w, err.Error(), http.StatusUnauthorized)
				return
			}
			decoder := json.NewDecoder(req.Body)
			var comment Comment
			err = decoder.Decode(&comment)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			// Create the comment
			comment.UserID = userID
			comment.DuelID = duelID
			db.Table("comments").Create(&comment)

			w.WriteHeader(http.StatusOK)
		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
}
func countCommenthandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// get the ID of duel
		duelID := getDuelIDFromRequest(req)

		if req.Method == "GET" {
			var cpt int64
			db.Table("comments").Where("duel_id = ?", duelID).Count(&cpt)

			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(cpt)
		}
	}
}
