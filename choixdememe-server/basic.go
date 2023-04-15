package main

import (
	"net/http"
	"strconv"
)

func getDuelIDFromRequest(req *http.Request) int{
	duelIDStr := req.URL.Query().Get("duel_id")
	duelID, err := strconv.Atoi(duelIDStr)
	if err != nil {
		return 0
	}
	return duelID
}

func getUserIDFromRequest(r *http.Request) int{
	return 0
}
