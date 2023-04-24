package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"gorm.io/gorm"
)

type User struct {
    ID       int   `gorm:"primaryKey"`
    Username string `json:"username"`
    Email    string `json:"email"`
    Password string `json:"password"`
}


func createUser(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        decoder := json.NewDecoder(r.Body)
        var user User
        err := decoder.Decode(&user)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        //log.Printf("Received JSON: %+v", user)

        if db == nil {
            log.Println("Error: db is nil")
            return
        }
        // Hash password with MD5
        hasher := md5.New()
        hasher.Write([]byte(user.Password))
        user.Password = hex.EncodeToString(hasher.Sum(nil))

        db.Table("users").Create(&user)

        //log.Printf("Created user: %+v", user)

        w.WriteHeader(http.StatusCreated)
        json.NewEncoder(w).Encode(user)
    }
}

func loginHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        decoder := json.NewDecoder(r.Body)
        var user User
        err := decoder.Decode(&user)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        // Hash password with MD5
        hasher := md5.New()
        hasher.Write([]byte(user.Password))
        user.Password = hex.EncodeToString(hasher.Sum(nil))

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

        log.Println("User logged in:", dbUser.Username)


        // Generate token
        token, err := generateToken(dbUser.ID, db)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        // Add token to response headers
        w.Header().Set("Authorization", fmt.Sprintf("Bearer %s", token.Value))

        // Return user information as response body
        w.WriteHeader(http.StatusOK)
        json.NewEncoder(w).Encode(dbUser)
    }
}

