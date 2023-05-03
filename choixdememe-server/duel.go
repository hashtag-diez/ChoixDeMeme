package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/peterhellberg/giphy"
	"gorm.io/gorm"
)

type Duel struct {
	Id       int    `json:"id"`
	URL1     string `json:"url1"`
	Caption1 string `json:"caption1"`
	URL2     string `json:"url2"`
	Caption2 string `json:"caption2"`
	UserID   int    `json:"user_id"`
}

type DuelWithVotesAndComments struct {
	ID         int    `json:"id"`
	URL1       string `json:"url1"`
	Caption1   string `json:"caption1"`
	URL2       string `json:"url2"`
	Caption2   string `json:"caption2"`
	UserID     int    `json:"uid"`
	Vote1Count int    `json:"vote_count1"`
	Vote2Count int    `json:"vote_count2"`
}

func duelHandler(g *giphy.Client, db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		// check token
		if req.Method == "GET" {
			// Parse the query parameters
			limitStr := req.URL.Query().Get("limit")
			limit, err := strconv.Atoi(limitStr)
			if err != nil {
				limit = 10 // Set a default limit if limit parameter is not provided or is invalid
			}

			startStr := req.URL.Query().Get("start")
			start, err := strconv.Atoi(startStr)
			if err != nil {
				start = 0 // Set a default start index if start parameter is not provided or is invalid
			}

			endStr := req.URL.Query().Get("end")
			end, err := strconv.Atoi(endStr)
			if err != nil {
				end = start + limit // Set a default end index if end parameter is not provided or is invalid
			}

			// Retrieve the duels with votes and comments
			duelsWithVotesAndComments, err := getDuelsWithVotesAndComments(db)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			duelsWithVotesAndComments = duelsWithVotesAndComments[start:end]

			// Return the duels as a response
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(duelsWithVotesAndComments)

		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
}

func userDuelHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		userID, err := getUserIDFromRequest(req, db)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		if req.Method == "GET" {
			// Retrieve the duels with votes and comments for the user
			duelsWithVotesAndComments, err := getUserDuelsWithVotesAndComments(db, userID)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Return the duels as a response
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(duelsWithVotesAndComments)

		} else if req.Method == "POST" {
			// Parse the request body
			decoder := json.NewDecoder(req.Body)
			var duel Duel
			err := decoder.Decode(&duel)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}

			// Get the user ID from the request
			duel.UserID = userID

			// Save the new duel to the database
			db.Table("duels").Create(&duel)


			// create the vote for the duel
			vote := Vote{
				DuelID:   duel.Id,
				Vote1Count: 0,
				Vote2Count: 0,
			}
			db.Table("votes").Create(&vote)

			// Return the new duel as a response
			w.Header().Set("Content-Type", "application/json")
		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
}

func getDuelsWithVotesAndComments(db *gorm.DB) ([]DuelWithVotesAndComments, error) {
	var duelsWithVotesAndComments []DuelWithVotesAndComments

	// Join the duels, votes and comments tables and retrieve the data
	err := db.Table("duels").
		Distinct("duels.*, votes.vote1_count, votes.vote2_count").
		Joins("left join votes on duels.id = votes.duel_id").
		Find(&duelsWithVotesAndComments).Error

	if err != nil {
		return nil, err
	}

	return duelsWithVotesAndComments, nil
}

func getUserDuelsWithVotesAndComments(db *gorm.DB, userID int) ([]DuelWithVotesAndComments, error) {
	var duelsWithVotesAndComments []DuelWithVotesAndComments

	// Join the duels, votes and comments tables and retrieve the data
	err := db.Table("duels").
		Distinct("duels.*, votes.vote1_count, votes.vote2_count").
		Joins("left join votes on duels.id = votes.duel_id").
		Where("duels.user_id = ?", userID).
		Find(&duelsWithVotesAndComments).Error

	if err != nil {
		return nil, err
	}

	return duelsWithVotesAndComments, nil
}

func addDuels(g *giphy.Client, db *gorm.DB) error {
	args := make([]string, 0)
	for i := 0; i < 20; i++ {
		// Get GIFs from GIPHY API
		gif1, err := g.Random(args)
		if err != nil {
			return err
		}
		gif2, err := g.Random(args)
		if err != nil {
			return err
		}
		c1 := gif1.Data.Caption
		if c1 == "" {
			c1 = gif1.Data.Username + " GIF"
		}
		c2 := gif2.Data.Caption
		if c2 == "" {
			c2 = gif2.Data.Username + " GIF"
		}
		// Create Duel record
		duel := &Duel{
			URL1:     gif1.Data.MediaURL(),
			Caption1: c1,
			URL2:     gif2.Data.MediaURL(),
			Caption2: c2,
			UserID:   0,
		}

		// Save Duel record to database
		if err := db.Table("duels").Create(&duel).Error; err != nil {
			return err
		}

		// create the vote for the duel
		vote := Vote{
			DuelID:   duel.Id,
			Vote1Count: 0,
			Vote2Count: 0,
		}
		db.Table("votes").Create(&vote)
	}

	return nil
}
