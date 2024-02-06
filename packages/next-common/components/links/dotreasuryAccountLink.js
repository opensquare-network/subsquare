import React from "react";
import { useChain } from "../../context/chain";
import getChainSettings from "next-common/utils/consts/settings";
import IconLink from "./iconLink";
import DotreasurySVG from "@osn/icons/subsquare/LinkDotreasury";

export function DotreasuryChainAccountLink({ chain, address }) {
  const dotreasuryChains = ["kusama", "polkadot"];
  if (!address || !dotreasuryChains.includes(chain)) {
    return null;
  }

  const chainSetting = getChainSettings(chain);
  const dotreasuryHref = `https://dotreasury.com/${chainSetting.symbol}/users/${address}`;

  return <IconLink href={dotreasuryHref} icon={<DotreasurySVG />} />;
}

function DotreasuryAccountLink({ address }) {
  const chain = useChain();
  return <DotreasuryChainAccountLink chain={chain} address={address} />;
}

export default DotreasuryAccountLink;
