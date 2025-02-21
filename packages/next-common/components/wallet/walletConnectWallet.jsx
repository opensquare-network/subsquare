import { isNil } from "lodash-es";
import { useWalletConnect } from "next-common/context/walletconnect";
import { useWeb3WalletView } from "next-common/hooks/connect/useWeb3WalletView";
import WalletOption from "./walletOption";

export default function WalletConnectWallet({ wallet }) {
  const { setView } = useWeb3WalletView();
  const { provider } = useWalletConnect();

  return (
    <WalletOption
      installed
      loading={isNil(provider)}
      logo={<wallet.logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      onClick={() => {
        setView("walletconnect");
      }}
    />
  );
}
