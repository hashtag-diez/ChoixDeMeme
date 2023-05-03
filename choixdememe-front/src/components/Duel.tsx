import React, { useState } from "react";
import { useAtom } from "jotai";
import {duelAtom} from "../atoms/Duel";
import Modal from "./Comments";
import { TDuel } from "../types";
import userAtom from "../atoms/User";

type DuelResponse = {
  id: number;
  url1: string;
  caption1: string;
  url2: string;
  caption2: string;
  uid: number;
  vote_count1: number;
  vote_count2: number;
};

function isInvalid(data:DuelResponse): boolean{
  return data.caption1=="" && data.caption2=="" && data.url1=="" && data.url2==""
}
const Duel = () => {
  const [chose, setChose] = useState(false);
  const [match, setMatch] = useAtom(duelAtom);
  const [user, _] = useAtom(userAtom);
  const [appear, setAppear] = useState(false)
  const style1 = {
    "--var":
      ((match[0].vote1 / ((match[0].vote2 + match[0].vote1)==0 ? 1 : (match[0].vote2 + match[0].vote1))) * 100)
        .toFixed(0)
        .toString() + "%",
  } as React.CSSProperties;

  const style2 = {
    "--var":
      ((match[0].vote2 / ((match[0].vote2 + match[0].vote1)==0 ? 1 : (match[0].vote2 + match[0].vote1))) * 100)
        .toFixed(0)
        .toString() + "%",
  } as React.CSSProperties;

  async function populate(base: TDuel[]) {
    const newMatches = [...base]
    let start = parseInt(localStorage.getItem("memes-index"))
    let data: DuelResponse[] = await (
      await fetch("https://choixdememe-production.up.railway.app/duel?start="+start, {
        method: "GET",
      })
    ).json();
    for(let i = 0; i<data.length;i++){
      if(isInvalid(data[i])){
        localStorage.setItem("memes-index", "0")
        setMatch(newMatches)
        return populate(newMatches)
      }
      let match: TDuel = {
        duel_id: data[i].id,
        player1: {
          link: data[i].url1,
          caption: data[i].caption1,
        },
        player2: {
          link: data[i].url2,
          caption: data[i].caption2,
        },
        comments: [],
        vote1: data[i].vote_count1,
        vote2: data[i].vote_count2,
      };
      let comm = await (
        await fetch("https://choixdememe-production.up.railway.app/comment?duel_id=" + data[i].id)
      ).json();
      match.comments = new Array(comm.length).fill({});
      newMatches.push(match);
    }
    return newMatches
  }
  async function refresh() {
    const newStart = parseInt(localStorage.getItem("memes-index")) + 1
    localStorage.setItem("memes-index", newStart.toString())
    let newmatches = [...match]
    if(match.length==1) {
      newmatches = await populate(newmatches)
    }
    newmatches.shift()
    setMatch(newmatches)
    console.log(match)
    setChose(false)
    setAppear(false)
  }

  async function vote(arg0: number) {
    if(!chose){
      const newmatches = [...match]
      newmatches[0].vote1 = newmatches[0].vote1 + (arg0==1 ? 1 : 0)
      newmatches[0].vote2 = newmatches[0].vote2 + (arg0==1 ? 0 : 1)
      if(user.id!==-1){
        let body = {
          duel_id: match[0].duel_id,
          option: arg0
        }
        let headers = {
          "Access-Control-Request-Headers": "*",
          "Authorization": localStorage.getItem("memes-token"),
        }
        let res = await fetch("https://choixdememe-production.up.railway.app/vote?duel_id=", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(body)
        })
        let data = await res.json()
        console.log(data)
        console.log(res.status)
      }else {
        // User is not logged in, show login prompt and display current vote record
        let voteRecord = {vote1: match[0].vote1, vote2: match[0].vote2}
        alert("Please log in to vote. Your vote does not count. ")
        console.log("Current vote record: ", voteRecord)
      }
      setMatch(newmatches)
      setChose(true)
    }
  }

  return (
    <article className="duel">
      <section
        className={`${!chose ? "equal" : "poll"}`}
        style={style1}
        onClick={() => vote(1)}
      >
        <img src={match[0].player1.link} alt="" />
        <div className="hero">
          <span className="caption">{match[0].player1.caption}</span>
          <div className={`results ${!chose ? "invisible" : "appear"}`}>
            {((match[0].vote1 / (match[0].vote2 + match[0].vote1)) * 100).toFixed(0)}%
            <span className="count">{match[0].vote1} votes</span>
          </div>
        </div>
      </section>
      {chose ? "" : <span className="or">OR</span>}
      {!chose ? (
        ""
      ) : (
        <>
          <div className="options">
            <button className="next appear" onClick={() => refresh()}>NEXT QUESTION</button>
            {!appear ? (
              <div className="comments" onClick={() => setAppear(true)}>
                <img src="/comments.svg" alt="" />
                COMMENTS
              </div>
            ) : (
              <Modal setAppear={setAppear} />
            )}
          </div>
        </>
      )}
      <section
        className={`${!chose ? "equal" : "poll"}`}
        style={style2}
        onClick={() => vote(2)}
      >
        <img src={match[0].player2.link} alt="" />
        <div className="hero">
          <span className="caption">{match[0].player2.caption}</span>
          <div className={`results ${!chose ? "invisible" : "appear"}`}>
            {((match[0].vote2 / (match[0].vote2 + match[0].vote1)) * 100).toFixed(0)}%
            <span className="count">{match[0].vote2} votes</span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Duel;

