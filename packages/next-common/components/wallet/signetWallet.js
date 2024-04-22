import React from "react";
import Flex from "../styled/flex";
import Loading from "../loading";
import WalletOption from "./walletOption";
import { useSignetSdk } from "next-common/context/signet";
import { SystemLink } from "@osn/icons/subsquare";

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
        <a
          href="https://www.talisman.xyz/signet"
          target="_blank"
          rel="noreferrer"
        >
          <SystemLink className="[&_path]:fill-theme500 !w-[20px] !h-[20px]" />
        </a>
      )}
      {(loading || installed === null) && <Loading />}
    </WalletOption>
  );
}
