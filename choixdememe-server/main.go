package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/peterhellberg/giphy"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type RandomResponse struct {
	ID  string `json:"id"`
	URL string `json:"url"`
}

type HelloResponse struct {
	Message string `json:"message"`
}

var db *gorm.DB

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func helloHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	res := HelloResponse{Message: "Hello World !"}
	json.NewEncoder(w).Encode(res)
}

func randomHandler(g *giphy.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		enableCors(&w)
		w.Header().Set("Content-Type", "application/json")
		if err := godotenv.Load(); err != nil {
			log.Print("No .env file found")
		}
		args := make([]string, 0)
		res, err := g.Random(args)
		if err != nil {
			res := HelloResponse{Message: "Erreur"}
			json.NewEncoder(w).Encode(res)
		} else {
			gif := res.Data
			id := gif.Caption
			if id == "" {
				id = res.Data.Username + " GIF"
			}
			res := RandomResponse{ID: id, URL: gif.MediaURL()}
			json.NewEncoder(w).Encode(res)
		}
	}
}

func main() {
	fmt.Println("Starting server...")
	// connect to database
	var err error
	db, err = gorm.Open(sqlite.Open("memes.db"), &gorm.Config{})
	if err != nil {
		panic("failed to connect database" + err.Error())
	}

	db.Logger.LogMode(logger.Info)
	videDuels(db)
	// add 10 duels to database
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	g := giphy.DefaultClient
	key, _ := os.LookupEnv("GIPHY_API_KEY")
	g.APIKey = key
	err = addDuels(g, db)
	if err != nil {
		panic(err)
	}
	fmt.Println("Duel data successfully added to database.")

	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/random", randomHandler(g))

	http.HandleFunc("/users", createUser(db))
	http.HandleFunc("/users/login", loginHandler(db))
	http.HandleFunc("/vote", voteHandler(db))
	http.HandleFunc("/duel", duelHandler(g, db))
	http.HandleFunc("/users/duel", userDuelHandler(db))
	http.HandleFunc("/comment", commentaireHandler(db))

	fmt.Println("Server started and listening on port 8000...")
	log.Fatal(http.ListenAndServe(":8000", nil))

	// block main thread
	select {}
}
