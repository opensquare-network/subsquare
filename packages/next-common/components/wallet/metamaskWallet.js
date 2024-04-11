import React, { useEffect, useState } from "react";
import Flex from "../styled/flex";
import useIsMounted from "../../utils/hooks/useIsMounted";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { getMetaMaskEthereum } from "next-common/utils/metamask";

export function MetaMaskWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const [installed, setInstalled] = useState(null);
  const isMounted = useIsMounted();
  const Logo = wallet.logo;

  useEffect(() => {
    setTimeout(() => {
      if (isMounted.current) {
        const ethereum = getMetaMaskEthereum();
        if (ethereum) {
          setInstalled(true);
        } else {
          setInstalled(false);
        }
      }
    }, 1000);
  }, [isMounted]);

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
