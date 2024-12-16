import React from "react";
import { useChain } from "../../context/chain";
import { WalletMimirLight } from "@osn/icons/subsquare";
import { useChainSettings } from "next-common/context/chain";
import { usePathname } from "next/navigation";

function ConditionalMimirIcon({ address }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const pathname = usePathname();
  const isProfilePage = pathname.startsWith("/user");

  // TODO: query statescan API to check whether it's a multisig address
  if (!isProfilePage || !address || !chainSettings?.multisigWallets?.mimir) {
    return null;
  }

  const href = `https://app.mimir.global/?address=${address}&network${chain}`;

  return (
    <a href={href} target="_blank" rel="noreferrer" className="cursor-pointer">
      <WalletMimirLight className="w-5 h-5" />
    </a>
  );
}

export default ConditionalMimirIcon;
