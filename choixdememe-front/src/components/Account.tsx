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
  user_id: number;
};
type VoteResponse = {
  DuelID: number;
  vote1_count: number;
  vote2_count: number;
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
    console.log(data)
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
        vote1: 0,
        vote2: 0,
      };
      let vote: VoteResponse = await (
        await fetch("http://localhost:8000/vote?duel_id=" + data[i].id)
      ).json();
      match.vote1 = vote.vote1_count;
      match.vote2 = vote.vote2_count;
      let comm: CommentReponse[] = await (
        await fetch("http://localhost:8000/comment?duel_id=" + data[i].id)
      ).json();
      match.comments = comm;
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
