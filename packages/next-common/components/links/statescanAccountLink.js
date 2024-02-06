import { useChain } from "next-common/context/chain";
import IconLink from "./iconLink";
import Chains from "next-common/utils/consts/chains";
import StatescanSVG from "@osn/icons/subsquare/LinkStatescan";
import getChainSettings from "next-common/utils/consts/settings";

const statescanDomainMap = {
  [Chains.development]: "gov2",
};

export function StatescanChainAccountLink({ chain, address }) {
  const { hasStatescan } = getChainSettings(chain);
  if (!hasStatescan) {
    return null;
  }

  return (
    <IconLink
      href={`https://${
        statescanDomainMap[chain] || chain
      }.statescan.io//#/accounts/${address}`}
      icon={<StatescanSVG />}
    />
  );
}

export default function StatescanAccountLink({ address }) {
  const chain = useChain();
  return <StatescanChainAccountLink chain={chain} address={address} />;
}
