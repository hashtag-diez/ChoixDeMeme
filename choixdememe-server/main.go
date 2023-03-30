package main

import (
	/* "gorm.io/gorm" */
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/peterhellberg/giphy"
)

type RandomResponse struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

type HelloResponse struct {
	Message string `json:"message"`
}

func main() {
	g := giphy.DefaultClient
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	key, _ := os.LookupEnv("GIPHY_API_KEY")
	g.APIKey = key

	helloHandler := func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		res := HelloResponse{Message: "Hello World !"}
		json.NewEncoder(w).Encode(res)
	}

	randomHandler := func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		res, err := g.Trending()
		if err != nil {
			res := HelloResponse{Message: "Erreur"}
			json.NewEncoder(w).Encode(res)
		} else {
			gif := res.Data[rand.Intn(len(res.Data))]
			res := RandomResponse{ID: gif.Caption, URL: gif.BitlyGifURL}
			json.NewEncoder(w).Encode(res)
		}
	}

	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/random", randomHandler)
	http.ListenAndServe(":8000", nil)
}
