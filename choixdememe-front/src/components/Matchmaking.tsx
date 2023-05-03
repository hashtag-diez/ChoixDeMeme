import React, { FormEvent, useState } from "react";
import GIFPicker from "./GIFPicker";
import { TGIF } from "../types";
import { myDuelAtom } from "../atoms/Duel";
import { useAtom } from "jotai";

const Matchmaking = ({ setAppear }) => {
  const [gif1, setGif1] = useState<TGIF>(null);
  const [gif2, setGif2] = useState<TGIF>(null);
  const [duels, setDuels] = useAtom(myDuelAtom)
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if(gif1==null || gif2==null){
      alert("Choose 2 GIF")
      return
    }
    let form = new FormData(e.target as HTMLFormElement);
    let body = {
      URL1: gif1.link,
      Caption1: (form.get("caption1")=="" ? gif1.caption :  form.get("caption1")),
      URL2: gif2.link,
      Caption2: (form.get("caption2")=="" ? gif2.caption :  form.get("caption2")),
    }
    let headers = {
      "Access-Control-Request-Headers": "*",
      "Authorization": localStorage.getItem("memes-token"),
    }
    let res = await fetch("https://choixdememe-production.up.railway.app/users/duel",
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    if(res.status==200){
      const newDuels = [...duels]
      newDuels.push({
        duel_id: Date.now(),
        comments: [],
        player1: {
          link: gif1.link,
          caption: (form.get("caption1")=="" ? gif1.caption :  form.get("caption1") as string),
        },
        player2: {
          link: gif2.link,
          caption: (form.get("caption2")=="" ? gif2.caption :  form.get("caption2") as string)
        },
        vote1: 0,
        vote2: 0
      })
      setDuels(newDuels)
      setAppear(false)
    }
  }

  return (
    <div className="modal match">
      <main>
        <button className="leave" onClick={() => setAppear(false)}>
          X
        </button>
        <h1>MATCHMAKING</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="matchmaking">
          <div className="selection">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3.4rem",
              }}
            >
              {gif1 == null ? (
                <GIFPicker setGif={(g) => setGif1(g)} />
              ) : (
                <div style={{position: "relative"}}>
                  <img className="gif_selected" src={gif1.link} alt="" />
                  <img src="trash.png" className="trash" alt="" onClick={() => setGif1(null)} />
                </div>
              )}
              <input
                type="text"
                name="caption1"
                id=""
                placeholder="Image 1..."
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "3.4rem",
              }}
            >
              {gif2 == null ? (
                <GIFPicker setGif={(g) => setGif2(g)} />
              ) : (
                <div style={{position: "relative"}}>
                  <img className="gif_selected" src={gif2.link} alt="" />
                  <img src="trash.png" className="trash" alt=""  onClick={() => setGif2(null)}/>
                </div>
              )}
              <input
                type="text"
                name="caption2"
                id=""
                placeholder="Image 2..."
              />
            </div>
          </div>
          <button
            className="next appear"
            onClick={() => setAppear(true)}
            role="submit"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default Matchmaking;
