package main

import (
	"encoding/json"
	"fmt"
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

			// Retrieve the duels
			var duels []Duel
			db.Table("duels").Limit(limit).Find(&duels)
			fmt.Println(len(duels))
			// Return the duels as a response
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(duels)

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
			// Retrieve the duels
			var ids []Duel
			db.Table("duels").Where("user_id = ?", userID).Find(&ids)

			// Return the duels as a response
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(ids)

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

			var duels []Duel
			db.Table("duels").Where("user_id = ?", userID).Find(&duels)

			db.Table("votes").Create(Vote{DuelID: duels[len(duels)-1].Id})

			// Return the new duel as a response
			w.Header().Set("Content-Type", "application/json")
		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
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
		if err := db.Table("duels").Create(duel).Error; err != nil {
			return err
		}
	}

	return nil
}
