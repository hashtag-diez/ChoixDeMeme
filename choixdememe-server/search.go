package main

import (
	"encoding/json"
	"net/http"

	"github.com/peterhellberg/giphy"
)

type GIF struct {
	Caption string `json:"caption"`
	Link    string `json:"link"`
}

func searchHandler(g *giphy.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		if req.Method == "GET" {
			_, err := getUserIDFromRequest(req, db)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			// Parse the query parameters
			keyword := req.URL.Query().Get("keyword")
			if keyword == "" {
				http.Error(w, "Unsupported HTTP request query", http.StatusBadRequest)
				return
			}

			// Retrieve the duels
			var duels []GIF

			args := make([]string, 1)
			args = append(args, keyword)
			result, err := g.Search(args)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			for i := 0; i < len(result.Data); i++ {
				curr := result.Data[i]
				c := curr.Caption
				if c == "" {
					c = curr.Username + " GIF"
				}
				gif := GIF{Caption: c, Link: curr.MediaURL()}
				duels = append(duels, gif)
			}
			// Return the duels as a response
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(duels)

		} else {
			http.Error(w, "Unsupported HTTP method", http.StatusMethodNotAllowed)
			return
		}
	}
}
