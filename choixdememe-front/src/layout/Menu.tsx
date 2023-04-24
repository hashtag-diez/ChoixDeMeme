import { useAtom } from "jotai";
import React, { ReactNode, useState } from "react";
import userAtom from "../atoms/User";
import Auth from "../components/Auth";
import Account from "../components/Account";

const Menu = ({ children }: { children: ReactNode }) => {
  const [appear, setAppear] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [user, _] = useAtom(userAtom);
  const slideOut = () => {
    setAnimate(true);
    let timeout: NodeJS.Timeout;
    timeout = setTimeout(() => {
      setAnimate(false);
      setAppear(false);
      clearTimeout(timeout);
    }, 400);
  };
  return (
    <main>
      {!appear ? (
        <div className="burger" onClick={() => setAppear(true)}>
          <img src="./hamburger.png" alt="" />
        </div>
      ) : (
        <div className="menu">
          <nav className={`${animate ? "out" : ""}`}>
            <button onClick={() => slideOut()} className="close_menu">
              X
            </button>
            {user == null ? <Auth /> : <Account />}
          </nav>
        </div>
      )}
      {children}
    </main>
  );
};

export default Menu;
