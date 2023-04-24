package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
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

func helloHandler(w http.ResponseWriter, req *http.Request){
	w.Header().Set("Content-Type", "application/json")
		res := HelloResponse{Message: "Hello World !"}
		json.NewEncoder(w).Encode(res)
}

func randomHandler(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	g := giphy.DefaultClient
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	key, _ := os.LookupEnv("GIPHY_API_KEY")
	g.APIKey = key
	res, err := g.Trending()
	if err != nil {
		res := HelloResponse{Message: "Erreur"}
		json.NewEncoder(w).Encode(res)
	} else {
		gif := res.Data[rand.Intn(len(res.Data))]
		res := RandomResponse{ID: gif.ID, URL: gif.BitlyGifURL}
		json.NewEncoder(w).Encode(res)
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
	
	
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/random", randomHandler)

	// add 10 duels to database
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	key, _ := os.LookupEnv("GIPHY_API_KEY")
	err = addDuels(db, key)
	if err != nil {
		panic(err)
	}
	fmt.Println("Duel data successfully added to database.")

	http.HandleFunc("/users", createUser(db))
	http.HandleFunc("/users/login", loginHandler(db))
	http.HandleFunc("/vote", voteHandler(db))
	http.HandleFunc("/duel", duelHandler(db))
	http.HandleFunc("/comment", commentaireHandler(db))
	
	//vide duels
	videDuels(db)

	// disconnect database
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	fmt.Println("Server started and listening on port 8000...")
	http.ListenAndServe(":8000", nil)

	// block main thread
	select {}
}

