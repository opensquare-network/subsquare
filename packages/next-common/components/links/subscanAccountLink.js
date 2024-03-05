import { useChain } from "next-common/context/chain";
import IconLink from "./iconLink";
import { LinkSubscan } from "@osn/icons/subsquare";
import getChainSettings from "next-common/utils/consts/settings";

export function SubScanChainAccountLink({ chain, address }) {
  const { hasSubscan, subscanDomain } = getChainSettings(chain);
  if (!hasSubscan) {
    return null;
  }

  return (
    <IconLink
      href={`https://${subscanDomain || chain}.subscan.io/account/${address}`}
      icon={<LinkSubscan />}
    />
  );
}

export default function SubScanAccountLink({ address }) {
  const chain = useChain();
  return <SubScanChainAccountLink chain={chain} address={address} />;
}
