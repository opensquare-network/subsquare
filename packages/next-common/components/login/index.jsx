import { useState } from "react";
import LoginAccount from "./account";
import LoginWeb3 from "./web3";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";

function Title({ isWeb3 = true, isWalletConnectView = false }) {
  let action;
  let type;

  if (isWeb3) {
    action = "Connect";
    type = "Address";

    if (isWalletConnectView) {
      type = "WalletConnect";
    }
  } else {
    action = "Login";
    type = "Account";
  }

  return (
    <h3 className="text20Bold text-textPrimary">
      <span>{action} with </span>
      <span className="text-theme500">{type}</span>
    </h3>
  );
}

export default function Login() {
  const [isWeb3, setIsWeb3] = useState(true);
  const { isWalletConnectView } = useWeb3WalletView();

  return (
    <div className="space-y-6">
      <Title isWeb3={isWeb3} isWalletConnectView={isWalletConnectView} />

      {isWeb3 ? (
        <LoginWeb3 setIsWeb3={setIsWeb3} />
      ) : (
        <LoginAccount setIsWeb3={setIsWeb3} />
      )}
    </div>
  );
}
