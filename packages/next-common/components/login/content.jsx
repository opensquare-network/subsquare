import { useState } from "react";
import LoginEmailContent from "./emailContent";
import LoginWeb3LoginContent from "./web3LoginContent";
import LoginAccountLoginContent from "./accountLoginContent";

/**
 * @description used in login popup and login page
 */
export default function LoginContent({ initView = "web3" }) {
  // web3, account, email
  const [view, setView] = useState(initView);

  return (
    <>
      {view === "web3" && <LoginWeb3LoginContent setView={setView} />}

      {view === "account" && <LoginAccountLoginContent setView={setView} />}

      {view === "email" && <LoginEmailContent setView={setView} />}
    </>
  );
}
