package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"gorm.io/gorm"
)

type Duel struct {
    URL1     string `json:"url1"`
    Caption1 string `json:"caption1"`
    URL2     string `json:"url2"`
    Caption2 string `json:"caption2"`
    UserID   int    `json:"user_id"`
}

func duelHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, req *http.Request) {
        if req.Method == "GET" {
            // Get duels created by the current user
            userID := getUserIDFromRequest(req)

			// Parse the query parameters
            limitStr := req.URL.Query().Get("limit")
            limit, err := strconv.Atoi(limitStr)
            if err != nil {
                limit = 10 // Set a default limit if limit parameter is not provided or is invalid
            }
			
            // Retrieve the duels
            var duels []Duel
            db.Table("deuls").Where("user_id = ?", userID).Limit(limit).Find(&duels)

            // Return the duels as a response
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(duels)
			
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
            userID := duel.UserID
            duel.UserID = userID
            
            // Save the new duel to the database
            db.Table("duels").Create(&duel)
            
            // Return the new duel as a response
            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(duel)
        } else {
            http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
            return
        }
    }
}
