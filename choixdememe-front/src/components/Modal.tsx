import React from "react";
import userAtom from "../atoms/User";
import { useAtom } from "jotai";
import Avatar from "./Avatar";
import { TComment } from "../types";
import Comment from "./Comment";
const Modal = ({
  setAppear,
  comments,
}: {
  setAppear: React.Dispatch<React.SetStateAction<boolean>>;
  comments: TComment[];
}) => {
  const [user, setUser] = useAtom(userAtom);
  return (
    <div className="modal">
      <main>
        <button className="leave" onClick={() => setAppear(false)}>
          X
        </button>
        <h1>COMMENTS</h1>
        <form action="" className="comment_form">
          <div className="comment_input">
            <Avatar {...user} />
            <input type="text" placeholder="Write your comment" />
          </div>
          <button formAction="submit">
            <img src="send.png" alt="" />
          </button>
        </form>
        <section className="comments_list">
          {comments.length == 0
            ? <h2>No comments posted</h2>
            : comments.map((comm) => <Comment {...comm} />)}
        </section>
      </main>
    </div>
  );
};

export default Modal;