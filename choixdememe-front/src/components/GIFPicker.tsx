import React, { useEffect, useState } from "react";
import { TGIF } from "../types";

const GIFPicker = ({ setGif }) => {
  const [value, setValue] = useState("");
  const [display, setDisplay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TGIF[]>([]);
  let timeout: NodeJS.Timeout;
  const search = () => {
    setLoading(true);
  };
  useEffect(() => {
    clearTimeout(timeout);
    if (value !== "") {
      timeout = setTimeout(() => {
        search();
      }, 500);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [value]);

  return (
    <div style={{ position: "relative" }}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onFocus={(e) => setDisplay(true)}
        onBlur={(e) => setDisplay(false)}
        name=""
        id=""
        placeholder="Search for GIFs"
      />
      <img className="loupe" src="/loupe.png" alt="" />
      {!display ? (
        ""
      ) : (
        <div className="gif_results">
          {results.map((gif) => (
            <img className="" src={gif.link} alt="" />
          ))}
        </div>
      )}
    </div>
  );
};

export default GIFPicker;
