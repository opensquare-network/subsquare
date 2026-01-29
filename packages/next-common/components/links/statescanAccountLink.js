import { useChain, useChainSettings } from "next-common/context/chain";
import IconLink from "./iconLink";
import Chains from "next-common/utils/consts/chains";
import StatescanSVG from "@osn/icons/subsquare/LinkStatescan";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { isRelayChain } from "next-common/utils/chain";
import { useMemo } from "react";

const statescanDomainMap = {
  [Chains.development]: "gov2",
  [Chains.polkadotAssetHub]: "statemint",
  [Chains.westendAssetHub]: "westmint",
  [Chains.kusamaAssetHub]: "statemine",
  [Chains.paseoAssetHub]: "paseo",
  [Chains.hyperBridge]: "nexus",
};

export default function StatescanAccountLink({ address }) {
  const chain = useChain();
  const { integrations } = useChainSettings();

  const domain = useMemo(() => {
    if (isRelayChain(chain) && isAssetHubMigrated()) {
      return `assethub-${chain}`;
    }

    return statescanDomainMap[chain] || chain;
  }, [chain]);

  if (!integrations?.statescan) {
    return null;
  }

  return (
    <IconLink
      href={`https://${domain}.statescan.io/#/accounts/${address}`}
      icon={<StatescanSVG className="w-5 h-5" />}
    />
  );
}
