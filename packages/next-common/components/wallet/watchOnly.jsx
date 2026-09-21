import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import WalletOption from "./walletOption";

export default function WatchOnly({ wallet, selected }) {
  const { setView } = useWeb3WalletView();

  return (
    <WalletOption
      installed
      selected={selected}
      logo={<wallet.logo />}
      title={wallet.title}
      onClick={() => {
        setView("watch-only");
      }}
    />
  );
}
