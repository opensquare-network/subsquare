import { useChain, useChainSettings } from "next-common/context/chain";
import IconLink from "./iconLink";
import Chains from "next-common/utils/consts/chains";
import StatescanSVG from "@osn/icons/subsquare/LinkStatescan";

const statescanDomainMap = {
  [Chains.development]: "gov2",
  [Chains.polkadotAssetHub]: "statemint",
  [Chains.westendAssetHub]: "westmint",
  [Chains.kusamaAssetHub]: "statemine",
  [Chains.paseoAssetHub]: "paseo",
};

export default function StatescanAccountLink({ address }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  if (!integrations?.statescan) {
    return null;
  }

  return (
    <IconLink
      href={`https://${
        statescanDomainMap[chain] || chain
      }.statescan.io/#/accounts/${address}`}
      icon={<StatescanSVG />}
    />
  );
}
