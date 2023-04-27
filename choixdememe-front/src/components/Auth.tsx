import { useRef } from "react";

const Auth = () => {
  const pwInput = useRef<HTMLInputElement>(null);
  const pwConfirmInput = useRef<HTMLInputElement>(null);
  function check(input: string) {
    if (pwInput.current && pwConfirmInput.current) {
      if (input != pwInput.current.value) {
        pwConfirmInput.current.setCustomValidity("Passwords must be matching.");
      } else {
        pwConfirmInput.current.setCustomValidity("");
      }
    }
  }
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
        <input
          type="pwInput"
          name="password"
          ref={pwConfirmInput}
          placeholder="Password"
        />
        <input
          type="password"
          name="password"
          ref={pwConfirmInput}
          placeholder="Confirm Password"
        />
        <button className="next appear">Sign up</button>
      </form>
    </section>
  );
};

export default Auth;
