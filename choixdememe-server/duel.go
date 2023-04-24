package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"gorm.io/gorm"
)

type Duel struct {
    URL1     string `json:"url1"`
    Caption1 string `json:"caption1"`
    URL2     string `json:"url2"`
    Caption2 string `json:"caption2"`
    UserID   int    
}

func duelHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, req *http.Request) {
        // check token
        userID, err := getUserIDFromRequest(req, db)
        if err != nil {
            http.Error(w, err.Error(), http.StatusUnauthorized)
            return
        }
        if req.Method == "GET" {
			// Parse the query parameters
            limitStr := req.URL.Query().Get("limit")
            limit, err := strconv.Atoi(limitStr)
            if err != nil {
                limit = 10 // Set a default limit if limit parameter is not provided or is invalid
            }
			
            // Retrieve the duels
            var duels []Duel
            db.Table("duels").Where("user_id = ?", userID).Limit(limit).Find(&duels)

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

func addDuels(db *gorm.DB, apiKey string) error {
    for i := 0; i < 10; i++ {
        // Get GIFs from GIPHY API
        gif1, err := getGif(apiKey)
        if err != nil {
            return err
        }
        gif2, err := getGif(apiKey)
        if err != nil {
            return err
        }

        // Create Duel record
        duel := &Duel{
            URL1:     gif1.URL,
            Caption1: gif1.Caption,
            URL2:     gif2.URL,
            Caption2: gif2.Caption,
            UserID:   0,
        }

        // Save Duel record to database
        if err := db.Table("duels").Create(duel).Error; err != nil {
            return err
        }
    }

    return nil
}

func getGif(apiKey string) (*Gif, error) {
    // Build GIPHY API request URL
    url := fmt.Sprintf("http://api.giphy.com/v1/gifs/random?api_key=%s", apiKey)
    // Send HTTP GET request
    resp, err := http.Get(url)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    // Parse response JSON
    var result struct {
        Data struct {
            ImageURL string `json:"bitly_url"`
            Title    string `json:"title"`
        } `json:"data"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return nil, err
    }

    
    // Create Gif struct
    gif := &Gif{
        URL:     result.Data.ImageURL,
    }
    if result.Data.Title != "" {
        gif.Caption = result.Data.Title
    } else {
        gif.Caption = "Untitled"
    }
    
    return gif, nil
}

type Gif struct {
    URL     string
    Caption string
}
