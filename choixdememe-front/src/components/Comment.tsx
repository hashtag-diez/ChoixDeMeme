import { TComment } from "../types";
import Avatar from "./Avatar";

const Comment = (comment: TComment) => {
  const formatDate = (datePublication:Date) => {
    // Obtenez la date actuelle
    var dateActuelle = new Date();

    // Calculez la différence entre la date actuelle et la date de publication en millisecondes
    var differenceEnMillisecondes = dateActuelle.getTime() - datePublication.getTime();

    // Calculez la différence en secondes, minutes, heures et jours
    var secondes = Math.floor(differenceEnMillisecondes / 1000);
    var minutes = Math.floor(secondes / 60);
    var heures = Math.floor(minutes / 60);
    var jours = Math.floor(heures / 24);

    var message;
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
        <Avatar {...comment.author} />
        <div className="">
          {comment.author.username}
          <div className="comment_text">{comment.content}</div>
          <div className="comment_date">{formatDate(comment.creation_date)}</div>
        </div>
      </div>
    </>
  );
};

export default Comment;
