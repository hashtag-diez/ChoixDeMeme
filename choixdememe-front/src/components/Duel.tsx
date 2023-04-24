import React, { useState } from "react";
import { useAtom } from "jotai";
import duelAtom from "../atoms/Duel";
import Modal from "./Modal";
const Duel = () => {
  const [chose, setChose] = useState(false);
  const [match, setMatch] = useAtom(duelAtom);
  const [appear, setAppear] = useState(false)
  const style1 = {
    "--var":
      ((match.vote1 / (match.vote2 + match.vote1)) * 100)
        .toFixed(0)
        .toString() + "%",
  } as React.CSSProperties;

  const style2 = {
    "--var":
      ((match.vote2 / (match.vote2 + match.vote1)) * 100)
        .toFixed(0)
        .toString() + "%",
  } as React.CSSProperties;
  return (
    <article className="duel">
      <section
        className={`${!chose ? "equal" : "poll"}`}
        style={style1}
        onClick={() => (!chose ? setChose(true) : "")}
      >
        <img src={match.player1.link} alt="" />
        <div className="hero">
          <span className="caption">{match.player1.caption}</span>
          <div className={`results ${!chose ? "invisible" : "appear"}`}>
            {((match.vote1 / (match.vote2 + match.vote1)) * 100).toFixed(0)}%
            <span className="count">{match.vote1} votes</span>
          </div>
        </div>
      </section>
      {chose ? "" : <span className="or">OR</span>}
      {!chose ? (
        ""
      ) : (
        <>
          <div className="options">
            <button className="next appear">NEXT QUESTION</button>
            {!appear ? (
              <div className="comments" onClick={() => setAppear(true)}>
                <img src="/comments.svg" alt="" />
                COMMENTS
              </div>
            ) : (
              <Modal setAppear={setAppear} comments={match.comments}/>
            )}
          </div>
        </>
      )}
      <section
        className={`${!chose ? "equal" : "poll"}`}
        style={style2}
        onClick={() => (!chose ? setChose(true) : "")}
      >
        <img src={match.player2.link} alt="" />
        <div className="hero">
          <span className="caption">{match.player2.caption}</span>
          <div className={`results ${!chose ? "invisible" : "appear"}`}>
            {((match.vote2 / (match.vote2 + match.vote1)) * 100).toFixed(0)}%
            <span className="count">{match.vote2} votes</span>
          </div>
        </div>
      </section>
    </article>
  );
};

export default Duel;
