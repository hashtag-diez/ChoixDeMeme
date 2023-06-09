import { TComment } from "../types";
import Avatar from "./Avatar";

const Comment = (comment: TComment) => {
  const formatDate = (datePublication:Date) => {
    let dateActuelle = new Date();
    let differenceEnMillisecondes = dateActuelle.getTime() - datePublication.getTime();

    let secondes = Math.floor(differenceEnMillisecondes / 1000);
    let minutes = Math.floor(secondes / 60);
    let heures = Math.floor(minutes / 60);
    let jours = Math.floor(heures / 24);

    let message;
    if (jours > 0) {
      message = "publié il y a " + jours + " jour" + (jours > 1 ? "s" : "");
    } else if (heures > 0) {
      message = "publié il y a " + heures + " heure" + (heures > 1 ? "s" : "");
    } else if (minutes > 0) {
      message =
        "publié il y a " + minutes + " minute" + (minutes > 1 ? "s" : "");
    } else {
      message = "publié il y a quelques secondes";
    }
    return message
  };
  return (
    <>
      <div className="comment">
        <Avatar {...{id: comment.user_id, username:comment.username}} />
        <div className="">
          {comment.username}
          <div className="comment_text">{comment.comment}</div>
          <div className="comment_date">{formatDate(new Date(comment.created_at))}</div>
        </div>
      </div>
    </>
  );
};

export default Comment;
