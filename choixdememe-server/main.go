package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/peterhellberg/giphy"
	"github.com/rs/cors"

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

func helloHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	res := HelloResponse{Message: "Hello World !"}
	json.NewEncoder(w).Encode(res)
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

	mux := http.NewServeMux()
	mux.HandleFunc("/users", createUser(db))
	mux.HandleFunc("/users/login", loginHandler(db))
	mux.HandleFunc("/vote", voteHandler(db))
	mux.HandleFunc("/duel", duelHandler(g, db))
	mux.HandleFunc("/users/duel", userDuelHandler(db))
	mux.HandleFunc("/comment", commentaireHandler(db))
	mux.HandleFunc("/search", searchHandler(g))
	fmt.Println("Server started and listening on port 8000...")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:5173"},
		AllowedHeaders: []string{"Authorization"},
		Debug:          true,
	})

	handler := c.Handler(mux)
	log.Fatal(http.ListenAndServe(":8000", handler))

	// block main thread
	select {}
}
