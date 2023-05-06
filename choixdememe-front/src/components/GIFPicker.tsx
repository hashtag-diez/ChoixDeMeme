import { useState } from "react";
import { TGIF } from "../types";
import Loader from "./Loader";

const GIFPicker = ({ setGif }) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<TGIF[]>([]);
  const search = async () => {
    if(value!==""){
      setLoading(true);
      let headers = {
        "Access-Control-Request-Headers": "*",
        "Authorization": localStorage.getItem("memes-token"),
      }
      let res = await  fetch("https://choixdememes.onrender.com/search?keyword="+value, {
        method: "GET",
        headers: headers
      })
      let data: TGIF[] = await res.json()
      if(res.status==200){
        setResults(data)
      }
      setLoading(false);
    } else{
      setResults([])
      setLoading(true)
    }
  };
  return (
    <div style={{ position: "relative" }}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        name=""
        id=""
        placeholder="Search for GIFs"
      />
      <img className="loupe" src="/loupe.png" alt="" onClick={() => search()}/>
        <div className="gif_results">
          {!loading ? results.map((gif) => (
            <img key={gif.caption} className="gif_found" src={gif.link} alt="" onClick={() => setGif(gif)} />
          ))
        : <Loader/>}
        </div>
    </div>
  );
};

export default GIFPicker;
