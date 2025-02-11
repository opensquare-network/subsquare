import { useWalletConnect } from "next-common/context/walletconnect";
import WalletOption from "./walletOption";

export default function WalletConnectWallet({ wallet, onClick }) {
  const { fetchAddresses } = useWalletConnect();

  return (
    <WalletOption
      installed
      logo={<wallet.logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      onClick={() => {
        fetchAddresses();
        onClick?.();
      }}
    />
  );
}
