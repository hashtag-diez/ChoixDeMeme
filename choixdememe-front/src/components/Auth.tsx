import { FormEvent, useRef } from "react";
import { TUser } from "../types";
import userAtom from "../atoms/User";
import { useAtom } from "jotai";

const Auth = () => {
  const pwInput = useRef<HTMLInputElement>(null);
  const pwConfirmInput = useRef<HTMLInputElement>(null);
  const [_, setUser] = useAtom(userAtom);

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    let form = new FormData(e.target as HTMLFormElement);
    let res = await  fetch("http://localhost:8000/users/login", {
      method: "POST",
      body: JSON.stringify({
        Email: form.get('mail'),
        Password: form.get('password'),
      })
    })
    if(res.status==200){
      res.headers.forEach(console.log);
      localStorage.setItem("memes-token", res.headers.get("Authorization"))
      let data: TUser = await res.json()
      setUser(data)
    }
    // let form = new FormData(e)
  }
  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    let form = new FormData(e.target as HTMLFormElement);
    let res = await  fetch("http://localhost:8000/users", {
      method: "POST",
      body: JSON.stringify({
        Username: form.get("username"),
        Email: form.get('mail'),
        Password: form.get('password'),
      })
    })
    if(res.status==201){
      alert("Succès, vous pouvez vous connecter")
    }
    // let form = new FormData(e)
  }
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
      <form onSubmit={(e) => handleSignIn(e)} action="">
        <h1>Sign in</h1>
        <input type="mail" name="mail" placeholder="Mail" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button className="next appear" role="submit">
          Sign in
        </button>
      </form>
      <h2>No account ? Create one !</h2>
      <form onSubmit={(e) => handleSignUp(e)} action="">
        <h1>Sign up</h1>
        <input type="text" name="username" placeholder="Username" required />
        <input type="mail" name="mail" placeholder="Mail" required />
        <input
          type="password"
          name="password"
          ref={pwConfirmInput}
          placeholder="Password"
          required
        />
        <input
          type="password"
          name="password"
          ref={pwConfirmInput}
          placeholder="Confirm Password"
          required
        />
        <button className="next appear" role="submit">Sign up</button>
      </form>
    </section>
  );
};

export default Auth;
