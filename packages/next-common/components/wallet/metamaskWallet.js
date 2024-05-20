import { useEffect, useState } from "react";
import Flex from "../styled/flex";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { useIsMetamaskWallet } from "next-common/hooks/connect/useIsMetamask";

export function MetaMaskWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const [installed, setInstalled] = useState(null);
  const isMetamask = useIsMetamaskWallet();
  const Logo = wallet.logo;

  useEffect(() => {
    setTimeout(() => {
      if (isMetamask) {
        setInstalled(true);
      } else {
        setInstalled(false);
      }
    }, 1000);
  }, [isMetamask]);

  return (
    <WalletOption
      selected={selected}
      onClick={() => installed && onClick(wallet)}
      installed={installed}
    >
      <Flex>
        <Logo className={wallet.title} alt={wallet.title} />
        <span className="wallet-title">{wallet.title}</span>
      </Flex>
      {installed === false && (
        <span className="wallet-not-installed">Not installed</span>
      )}
      {(loading || installed === null) && <Loading />}
    </WalletOption>
  );
}
