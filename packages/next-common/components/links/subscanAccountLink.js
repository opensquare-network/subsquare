import { useChain, useChainSettings } from "next-common/context/chain";
import IconLink from "./iconLink";
import { LinkSubscan } from "@osn/icons/subsquare";

export default function SubScanAccountLink({ address }) {
  const chain = useChain();
  const { hasSubscan, subscanDomain } = useChainSettings();
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
