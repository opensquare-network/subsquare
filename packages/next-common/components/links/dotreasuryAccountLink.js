import React from "react";
import { useChain } from "../../context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import IconLink from "./iconLink";
import DotreasurySVG from "@osn/icons/subsquare/LinkDotreasury";

function DotreasuryAccountLink({ address }) {
  const dotreasuryChains = ["kusama", "polkadot"];
  const chain = useChain();

  if (!address || !dotreasuryChains.includes(chain)) {
    return null;
  }

  const chainSetting = getChainSettings(chain);
  const dotreasuryHref = `https://dotreasury.com/${chainSetting.symbol}/users/${address}`;

  return (
    <IconLink
      href={dotreasuryHref}
      icon={<DotreasurySVG className="w-5 h-5" />}
    />
  );
}

export default DotreasuryAccountLink;
