import { useState } from "react";
import LoginAccount from "./account";
import LoginWeb3 from "./web3";

function Title({ isWeb3 = true }) {
  return (
    <h3 className="text20Bold text-textPrimary">
      <span>{isWeb3 ? "Connect" : "Login"} with </span>
      <span className="text-theme500">{isWeb3 ? "Wallet" : "Account"}</span>
    </h3>
  );
}

export default function Login() {
  const [isWeb3, setIsWeb3] = useState(true);

  return (
    <div className="space-y-6">
      <Title isWeb3={isWeb3} />

      {isWeb3 ? (
        <LoginWeb3 setIsWeb3={setIsWeb3} />
      ) : (
        <LoginAccount setIsWeb3={setIsWeb3} />
      )}
    </div>
  );
}
