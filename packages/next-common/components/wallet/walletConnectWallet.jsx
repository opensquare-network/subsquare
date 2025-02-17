import { useWalletConnect } from "next-common/context/walletconnect";
import WalletOption from "./walletOption";
import { useWeb3Login } from "next-common/hooks/connect/useWeb3Login";

export default function WalletConnectWallet({ wallet }) {
  const { fetchAddresses } = useWalletConnect();
  const [web3Login] = useWeb3Login();

  function handleConnect() {
    fetchAddresses().then((addresses) => {
      if (!addresses.length) {
        return;
      }

      web3Login({
        account: { address: addresses[0] },
        wallet: wallet.extensionName,
      });
    });
  }

  return (
    <WalletOption
      installed
      logo={<wallet.logo className={wallet.title} alt={wallet.title} />}
      title={wallet.title}
      onClick={handleConnect}
    />
  );
}
