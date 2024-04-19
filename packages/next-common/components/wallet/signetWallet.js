import React from "react";
import Flex from "../styled/flex";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { useSignetSdk } from "next-common/context/signet";

export function SignetWallet({
  wallet,
  onClick,
  selected = false,
  loading = false,
}) {
  const data = useSignetSdk();
  const { inSignet: installed } = data;
  const Logo = wallet.logo;

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
