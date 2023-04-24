import React from "react";

const Auth = () => {
  return (
    <section className="auth">
      <form action="">
        <h1>Sign in</h1>
        <input type="mail" name="mail" placeholder="Mail" />
        <input type="password" name="password" placeholder="Password" />
        <button className="next appear">Sign in</button>
      </form>
      <h2>No account ? Create one !</h2>
      <form action="">
        <h1>Sign up</h1>
        <input type="text" name="text" placeholder="Username" />
        <input type="mail" name="mail" placeholder="Mail" />
        <input type="password" name="password" placeholder="Password" />
        <input type="password" name="password" placeholder="Confirm Password" />
        <button className="next appear">Sign up</button>
      </form>
    </section>
  );
};

export default Auth;
