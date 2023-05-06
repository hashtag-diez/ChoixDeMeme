import React from "react";
import userAtom from "../atoms/User";
import { useAtom } from "jotai";
import Avatar from "./Avatar";
import { TComment, TDuel } from "../types";
import Comment from "./Comment";
import { duelAtom } from "../atoms/Duel";
const Modal = ({
  setAppear,
}: {
  setAppear: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [user, _] = useAtom(userAtom);
  const [match, setMatch] = useAtom(duelAtom);

  async function handleComment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    let form = new FormData(e.target as HTMLFormElement)
    let body = {
      comment: form.get("comment").toString(),
    }
    let headers = {
      "Access-Control-Request-Headers": "*",
      "Authorization": localStorage.getItem("memes-token"),
    }
    let res = await fetch("https://choixdememes.onrender.com/comment?duel_id="+match[0].duel_id,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    })
    if(res.status){
      const newmatches: TDuel[] = [...match];
      (e.target as HTMLFormElement).reset()
      newmatches[0].comments.unshift({
        user_id: user.id,
        username: user.username,
        comment: form.get("comment").toString(),
        created_at: Date.now().toString(),
      })
      setMatch(newmatches)
    }
  }

  function compareDate(a: TComment, b: TComment): number {
    const date1 = new Date(a.created_at)
    const date2 = new Date(a.created_at)

    return (date1 > date2 ? 1 : 0)
  }

  return (
    <div className="modal">
      <main>
        <button className="leave" onClick={() => setAppear(false)}>
          X
        </button>
        <h1>COMMENTS</h1>
        {user.id !== -1 ? (
          <form action="" onSubmit={(e) => handleComment(e)} className="comment_form">
            <div className="comment_input">
              <Avatar {...user} />
              <input type="text" name="comment" style={{width: "100%"}} placeholder="Write your comment" />
            </div>
            <button formAction="submit">
              <img src="send.png" alt="" />
            </button>
          </form>
        ) : (
          <h2><u>Log in to comment</u></h2>
        )}
        <section className="comments_list">
          {match[0].comments==null || match[0].comments.length == 0 ? (
            <h2>No comments posted</h2>
          ) : (
            match[0].comments.sort((a,b) => compareDate(a,b)).map((comm) => {
              return <Comment key={comm.created_at} {...comm} />
            })
          )}
        </section>
      </main>
    </div>
  );
};

export default Modal;
