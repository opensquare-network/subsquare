import { useWalletConnectAccounts } from "next-common/context/walletconnect";
import MaybeSignerConnected from "./maybeSignerConnected";

export default function MaybeWalletConnectSigner({ children }) {
  const accounts = useWalletConnectAccounts();

  return (
    <MaybeSignerConnected extensionAccounts={accounts}>
      {children}
    </MaybeSignerConnected>
  );
}
