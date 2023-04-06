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

type User struct {
    Username string `json:"username"`
    Email string `json:"email"`
    Password string `json:"password"`
}

var db *gorm.DB

func createUser(w http.ResponseWriter, r *http.Request) {
    decoder := json.NewDecoder(r.Body)
    var user User
    err := decoder.Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    log.Printf("Received JSON: %+v", user)
	
	if db == nil {
		log.Println("Error: db is nil")
		return
	}
	
    db.Table("users").Create(&user)

    log.Printf("Created user: %+v", user)

    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(user)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
    decoder := json.NewDecoder(r.Body)
    var user User
    err := decoder.Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    var dbUser User
    err = db.Table("users").Where("username = ?", user.Username).First(&dbUser).Error
    if err != nil {
        http.Error(w, "Invalid username or password", http.StatusUnauthorized)
        return
    }

    if dbUser.Password != user.Password {
        http.Error(w, "Invalid username or password", http.StatusUnauthorized)
        return
    }
	
	fmt.Println("User logged in:", dbUser.Username)
	
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(dbUser)
}

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
	// connect to database
	
    var err error
	db, err = gorm.Open(sqlite.Open("memes.db"), &gorm.Config{})
	if err != nil {
    	panic("failed to connect database" + err.Error())
	}

	db.Logger.LogMode(logger.Info)
	
	
	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/random", randomHandler)
	http.HandleFunc("/users", createUser)
	http.HandleFunc("/users/login", loginHandler)


	// disconnect database
	sqlDB, _ := db.DB()
	defer sqlDB.Close()

	http.ListenAndServe(":8000", nil)

}

