package main

import (
	"encoding/json"
	"errors"

	"net/http"

	"gorm.io/gorm"
)

type Vote struct {
	DuelID     int `json:"duel_id"`
	Vote1Count int `json:"vote1_count"`
	Vote2Count int `json:"vote2_count"`
}

type Choice struct {
	DuelID int `json:"duel_id"`
	Option int `json:"option"`
}

type VoteUser struct {
	UserID int `gorm:"column:user_id"`
	DuelID int `gorm:"column:duel_id"`
}

func voteHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// get the ID of duel
		duelID := getDuelIDFromRequest(req)

		if req.Method == "GET" {
			// get the vote record for the duel
			var vote Vote
			if err := db.Table("votes").Where("duel_id = ?", duelID).First(&vote).Error; err != nil {
				http.Error(w, "Failed to retrieve vote record", http.StatusInternalServerError)
				return
			}

			// Return the vote record as JSON
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(vote)

		} else if req.Method == "POST" {
			// Check if user is authenticated
			userID, err := getUserIDFromRequest(req, db)
			if err != nil {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			decoder := json.NewDecoder(req.Body)
			var choice Choice
			err = decoder.Decode(&choice)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			// Check if user has already voted for the duel
			var voteUser VoteUser
			if err := db.Table("vote_user").Where("user_id = ? AND duel_id = ?", userID, choice.DuelID).First(&voteUser).Error; err != nil {
				if !errors.Is(err, gorm.ErrRecordNotFound) {
					http.Error(w, "Failed to retrieve user's vote", http.StatusInternalServerError)
					return
				}
			} else {
				w.WriteHeader(http.StatusAlreadyReported)
				return
			}

			// Start a transaction to update vote count and vote user
			tx := db.Begin()
			var vote Vote

			if err := tx.Table("votes").Where("duel_id = ?", choice.DuelID).First(&vote).Error; err != nil {
				if errors.Is(err, gorm.ErrRecordNotFound) {
					// Create a new vote record if it doesn't exist yet
					vote = Vote{DuelID: choice.DuelID, Vote1Count: 0, Vote2Count: 0}
					if err := tx.Table("votes").Create(&vote).Error; err != nil {
						tx.Rollback()
						http.Error(w, "Failed to create vote record", http.StatusInternalServerError)
						return
					}
				} else {
					tx.Rollback()
					http.Error(w, "Failed to retrieve vote record", http.StatusInternalServerError)
					return
				}
			}

			if choice.Option == 1 {
				vote.Vote1Count++
			} else {
				vote.Vote2Count++
			}

			if err := tx.Table("votes").Where("duel_id = ?", vote.DuelID).Save(&vote).Error; err != nil {
				tx.Rollback()
				http.Error(w, "Failed to update vote count", http.StatusInternalServerError)
				return
			}

			if err := tx.Table("vote_user").Create(&VoteUser{UserID: userID, DuelID: choice.DuelID}).Error; err != nil {
				tx.Rollback()
				http.Error(w, "Failed to create vote_user record", http.StatusInternalServerError)
				return
			}

			tx.Commit()

			// Return the updated vote record
			w.WriteHeader(http.StatusOK)
			json.NewEncoder(w).Encode(vote)

		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
}
