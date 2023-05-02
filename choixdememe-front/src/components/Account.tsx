import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import userAtom from "../atoms/User";
import Avatar from "./Avatar";
import Matchmaking from "./Matchmaking";
import { TDuel } from "../types";
import { myDuelAtom } from "../atoms/Duel";

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

type CommentReponse = {
  Comment: string;
  UserID: number;
  DuelID: number;
};
const Account = () => {
  const [user, setUser] = useAtom(userAtom);
  const [duels, setDuels] = useAtom(myDuelAtom);
  const [appear, setAppear] = useState(false);
  const [loading, setLoading] = useState(true);
  async function logOut(){
    let headers = {
      "Access-Control-Request-Headers": "*",
      Authorization: localStorage.getItem("memes-token"),
    };
    let res = await fetch("http://localhost:8000/users/logout", {
      method: "GET",
      headers: headers,
    })
    if(res.status==201){
      localStorage.removeItem("memes-token")
      setDuels([])
      setUser({
        id: -1,
        username: "disconnected"
      })
    }
  }
  async function fetchDuels() {
    let headers = {
      "Access-Control-Request-Headers": "*",
      Authorization: localStorage.getItem("memes-token"),
    };
    let res = await fetch("http://localhost:8000/users/duel", {
      method: "GET",
      headers: headers,
    });
    let data: DuelResponse[] = await res.json();
    let tab: TDuel[] = [];
    for (let i = 0; i < data.length; i++) {
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
      let comm: number = await (
        await fetch("http://localhost:8000/comment/count?duel_id=" + data[i].id)
      ).json();
      match.comments = new Array(comm).fill({});
      tab.push(match);
    }
    setDuels(tab); 
    setLoading(false);
  }
  useEffect(() => {
    fetchDuels();
  }, []);
  return (
    <section className="accounting">
      <div className="comment">
        <Avatar {...user} />
        <div className="">
          Welcome&nbsp;
          {user.username}
        </div>
      </div>
      <button className="next appear" onClick={() => setAppear(true)}>
        New Match
      </button>
      {appear ? <Matchmaking setAppear={setAppear} /> : ""}
      <div>
        <h2>My matches</h2>
        {loading ? (
          <p> You have no matches yet. Create one !</p>
        ) : (
          <ul className="duel_list">
            {duels.map((duel) => (
              <li key={duel.duel_id} >
                <div className="duel_presentation">
                  <img src={duel.player1.link} alt="" />
                  <label style={{ left: "10%" }}>
                    {(
                      (duel.vote1 /
                        (duel.vote2 + duel.vote1 == 0
                          ? 1
                          : duel.vote2 + duel.vote1)) *
                      100
                    ).toFixed(0)}
                    %
                  </label>
                  <img src={duel.player2.link} alt="" />
                  <label style={{ right: "10%" }}>
                    {(
                      (duel.vote2 /
                        (duel.vote2 + duel.vote1 == 0
                          ? 1
                          : duel.vote2 + duel.vote1)) *
                      100
                    ).toFixed(0)}
                    %
                  </label>
                </div>
                <div>
                  <h3>
                    {duel.player1.caption} - {duel.player2.caption}
                  </h3>
                  {duel.vote1 + duel.vote2} vote(s) <br />
                  {duel.comments.length} commentaire(s)
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button className="next appear" onClick={() => logOut()} style={{ background: "#e74c3c" }}>
        Sign Out
      </button>
    </section>
  );
};

export default Account;
