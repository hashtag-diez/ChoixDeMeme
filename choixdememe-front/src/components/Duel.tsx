import React, { useState } from "react";
import { TDuel } from "../types";

const Duel = (match: TDuel) => {
  const [chose, setChose] = useState(false);
  return (
    <article className="duel">
      <section>
        <img src={match.player1.link} alt="" />
        <div className="hero">
        <span className="caption">{match.player1.caption}</span>
          <div className="results">
            {((match.vote1/(match.vote2+match.vote1))*100).toFixed(0)}%
            <span className="count">{match.vote1} votes</span>
          </div>
        </div>
      </section>
      <span className="or">OR</span>
      <section>
        <img src={match.player2.link} alt="" />
        <div className="hero">
          <span className="caption">{match.player2.caption}</span>
          <div className="results">
            {((match.vote2/(match.vote2+match.vote1))*100).toFixed(0)}%
            <span className="count">{match.vote2} votes</span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Duel;
