import React from "react";
import { nodes } from "../../utils/constants";
import { DotreasuryLinkWrapper } from "./thirdPartyLink";
import LinkDotreasuryIcon from "../../assets/imgs/icons/link-dotreasury.svg";
import LinkDotreasuryIconActive from "../../assets/imgs/icons/link-dotreasury-active.svg";
import { useChain } from "../../context/chain";

function DotreasuryAccountLink({ address }) {
  const dotreasuryChains = ["kusama", "polkadot"];
  const chain = useChain();

  if (!address || !dotreasuryChains.includes(chain)) {
    return null;
  }

  const chainSetting = nodes.find((node) => node.value === chain);

  return (
    <DotreasuryLinkWrapper
      href={`https://dotreasury.com/${chainSetting.symbol}/users/${address}`}
      target="_blank"
      rel="noreferrer"
    >
      <LinkDotreasuryIcon />
      <LinkDotreasuryIconActive />
    </DotreasuryLinkWrapper>
  );
}

export default DotreasuryAccountLink;
