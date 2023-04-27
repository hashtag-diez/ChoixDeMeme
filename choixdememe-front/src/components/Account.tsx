import { useAtom } from "jotai";
import React, { useState } from "react";
import userAtom from "../atoms/User";
import Avatar from "./Avatar";
import Matchmaking from "./Matchmaking";

const Account = () => {
  const [user, _] = useAtom(userAtom);
  const [duels, setDuels] = useState([])
  const [appear, setAppear] = useState(false)
  return (
    <section className="accounting">
      <div className="comment">
        <Avatar {...user} />
        <div className="">
          Welcome&nbsp;
          {user.username}
        </div>
      </div>
      <button className="next appear" onClick={() => setAppear(true)}>New Match</button>
      {appear ? <Matchmaking setAppear={setAppear} /> : ""}
      <div>
        <h2>My matches</h2>
        {duels.length == 0 ? <p> You have no matches yet. Create one !</p> : 
        <ul>
          {duels.map(duel =><li>
            <div className="duel_presentation">
              <img src={duel.player1.link} alt="" />
              <label style={{left: "10%"}}>{((duel.vote1 / (duel.vote2 + duel.vote1)) * 100).toFixed(0)}%</label>
              <img src={duel.player2.link} alt="" />
              <label style={{right: "10%"}}>{((duel.vote2 / (duel.vote2 + duel.vote1)) * 100).toFixed(0)}%</label>
            </div>
            <div>
              <h3>{duel.player1.caption} - {duel.player2.caption}</h3>
              {duel.vote1 + duel.vote2} vote(s)
            </div>
          </li>)}
        </ul>}
      </div>
      <button className="next appear" style={{ background: "#e74c3c" }}>
        Sign Out
      </button>
    </section>
  );
};

export default Account;
