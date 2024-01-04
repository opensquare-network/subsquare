import { useState } from "react";
import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";

/**
 * @description used in login popup and login page
 */
export default function LoginContent() {
  // web3, account, email
  const [view, setView] = useState("web3");

  return (
    <>
      {view === "web3" && <LoginWeb3LoginContent setView={setView} />}

      {view === "account" && <LoginAccountLoginContent setView={setView} />}
    </>
  );
}
