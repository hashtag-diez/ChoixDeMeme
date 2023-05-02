import { useEffect, useState } from "react";
import "./App.css";
import Duel from "./components/Duel";
import Menu from "./layout/Menu";
import { useAtom } from "jotai";
import { duelAtom } from "./atoms/Duel";
import { TDuel, TUser } from "./types";
import userAtom from "./atoms/User";
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
function App() {
  const [_, setMatched] = useAtom(duelAtom);
  const [loading, setLoading] = useState(true);
  const [__, setUser] = useAtom(userAtom);

  async function fetchDuels(){
    if(localStorage.getItem("memes-index")==null){
      localStorage.setItem("memes-index", "0")
    }
    let start = parseInt(localStorage.getItem("memes-index"))
    console.log(localStorage.getItem("memes-index"))
    let data: DuelResponse[] = await (
      await fetch("http://localhost:8000/duel?start="+start, {
        method: "GET",
      })
    ).json();
    console.log(data)
    const tab: TDuel[] = []
    for (let i = 0; i < data.length; i++) {
      if(isInvalid(data[i])) break
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
        await fetch("http://localhost:8000/comment?duel_id=" + data[i].id)
      ).json();
      console.log(comm)
      match.comments = comm
      tab.push(match);
    }
    console.log(tab)
    setMatched(tab); 
    setLoading(false)
  }

  async function getUserByToken() {
    if(localStorage.getItem("memes-token")!=null){
      let headers = {
        "Access-Control-Request-Headers": "*",
        "Authorization": localStorage.getItem("memes-token"),
      }
      let data: TUser = await (
        await fetch("http://localhost:8000/users/login", {
          method: "GET",
          headers: headers,
        })
      ).json();
      setUser(data)
      return
    }
    setUser({
      id: -1,
      username: "disconnected"
    })
  }
  
  useEffect(() => {
    fetchDuels()
    getUserByToken()
  }, [])
  return (
    <>
      {loading ? (
        ""
      ) : (
        <Menu>
          <Duel />
        </Menu>
      )}
    </>
  );
}

export default App;
