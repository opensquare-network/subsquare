import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import WalletOption from "./walletOption";

export default function WalletConnectWallet({ wallet }) {
  const { setView } = useWeb3WalletView();

  return (
    <WalletOption
      installed
      logo={<wallet.logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      onClick={() => {
        setView("walletconnect");
      }}
    />
  );
}
