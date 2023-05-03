package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/peterhellberg/giphy"
	"github.com/rs/cors"

	"gorm.io/driver/mysql"
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

func main() {
	fmt.Println("Starting server...")
	// connect to database
	var err error
	db, err := gorm.Open(mysql.Open(os.Getenv("DSN")), &gorm.Config{
		DisableForeignKeyConstraintWhenMigrating: true,
	})
	if err != nil {
		panic("failed to connect database" + err.Error())
	}

	db.Logger.LogMode(logger.Info)
	/* resetDatabase(db)
	fmt.Println("Data successfully reset.") */
	// add 10 duels to database
	if err := godotenv.Load(); err != nil {
		log.Print("No .env file found")
	}
	g := giphy.DefaultClient
	key, _ := os.LookupEnv("GIPHY_API_KEY")
	g.APIKey = key
	/* err = addDuels(g, db)
	if err != nil {
		panic(err)
	} */
	fmt.Println("Duel data successfully added to database.And the votes are created.")

	mux := http.NewServeMux()
	mux.HandleFunc("/users", createUser(db))
	mux.HandleFunc("/users/login", loginHandler(db))
	mux.HandleFunc("/users/logout", logoutHandler(db))
	mux.HandleFunc("/vote", voteHandler(db))
	mux.HandleFunc("/duel", duelHandler(g, db))
	mux.HandleFunc("/users/duel", userDuelHandler(db))
	mux.HandleFunc("/comment", commentaireHandler(db))
	mux.HandleFunc("/comment/count", countCommenthandler(db))
	mux.HandleFunc("/search", searchHandler(g))
	fmt.Println("Server started and listening on port 8000...")

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"https://6452b7970afb84183e8bbc24--frolicking-chebakia-1a4250.netlify.app"},
		AllowedHeaders: []string{"Authorization"},
		Debug:          true,
	})

	handler := c.Handler(mux)
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	log.Fatal(http.ListenAndServe("0.0.0.0:"+port, handler))

	// block main thread
	select {}
}
