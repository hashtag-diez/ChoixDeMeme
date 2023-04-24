package main

import (
	"encoding/json"
	"net/http"

	"gorm.io/gorm"
)

type Comment struct {
    Comment string `json:"comment"`
    UserID  int    `json:"user_id"`
    DuelID  int    `json:"duel_id"`
}

func commentaireHandler (db *gorm.DB) http.HandlerFunc{
	return func(w http.ResponseWriter, req *http.Request) {
	// check token
	userID, err := getUserIDFromRequest(req, db)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	// get the ID of duel
	duelID := getDuelIDFromRequest(req)

	if req.Method == "GET"{
        // get all comments for the duel
        var comments []Comment
        db.Table("comments").Where("duel_id = ?", duelID).Find(&comments)

        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(comments)

	}else if req.Method == "POST"{
		decoder := json.NewDecoder(req.Body)
    	var comment Comment
		err := decoder.Decode(&comment)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Create the comment
		comment.UserID = userID
		comment.DuelID = duelID
		db.Table("comments").Create(&comment)

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(comment)
	}else {
        http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
        return
    }
}
}