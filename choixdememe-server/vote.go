package main

import (
	"encoding/json"
	"net/http"

	"gorm.io/gorm"
)

type Vote struct{
    DuelID     int `json:"duel_id"`
    Vote1Count int `json:"vote1_count"`
    Vote2Count int `json:"vote2_count"`
}

type Choice struct {
    DuelID int `json:"duel_id"`
    Option int `json:"option"`
}

func voteHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, req *http.Request) {
	if req.Method == "GET"{
		// get the ID of duel
		duelID := getDuelIDFromRequest(req)
        
        // get the vote record for the duel
        var vote Vote
        if err :=db.Table("votes").Where("duel_id = ?", duelID).First(&vote).Error; err != nil {
            http.Error(w, "Failed to retrieve vote record", http.StatusInternalServerError)
            return
        }

       // Return the vote record as JSON
	   w.WriteHeader(http.StatusOK)
	   json.NewEncoder(w).Encode(vote)

	}else if req.Method == "POST"{
		decoder := json.NewDecoder(req.Body)
    	var choice Choice
		err := decoder.Decode(&choice)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// get the ID of duel
		duelID := getDuelIDFromRequest(req)


		// Start a transaction to update vote count
		tx := db.Begin()
		var vote Vote

		//vote.DuelID = duelID
		if err := tx.Where("duel_id = ?", duelID).First(&vote).Error; err != nil {
			tx.Rollback()
			http.Error(w, "Failed to retrieve vote record", http.StatusInternalServerError)
			return
		}

		if choice.Option == 1 {
			vote.Vote1Count++
		} else {
			vote.Vote2Count++
		}
		if err := tx.Save(&vote).Error; err != nil {
			tx.Rollback()
			http.Error(w, "Failed to update vote count", http.StatusInternalServerError)
			return
		}
		tx.Commit()

		// Return the updated vote record
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(vote)

	}else {
        http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
        return
    }
}

}

