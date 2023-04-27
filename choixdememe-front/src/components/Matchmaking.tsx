import React, { useState } from "react";
import GIFPicker from "./GIFPicker";

const Matchmaking = ({ setAppear }) => {
  const [gif1, setGif1] = useState("")
  const [gif2, setGif2] = useState("")
  return (
    <div className="modal">
      <main>
        <button className="leave" onClick={() => setAppear(false)}>
          X
        </button>
        <h1>MATCHMAKING</h1>
        <form action="" className="matchmaking">
          <div className="selection">
            <div>
              <GIFPicker setGif={setGif1}/>
              <input type="text" name="caption1" id="" placeholder="Image 1..."/>
            </div>
            <div>
              <GIFPicker setGif={setGif2}/>
              <input type="text" name="caption2" id="" placeholder="Image 2..."/>
            </div>
          </div>
          <button className="next appear" onClick={() => setAppear(true)} role="submit">
            Submit
          </button>
        </form>
      </main>
    </div>
  );
};

export default Matchmaking;
