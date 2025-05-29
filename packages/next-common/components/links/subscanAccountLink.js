import { useChain, useChainSettings } from "next-common/context/chain";
import IconLink from "./iconLink";
import { LinkSubscan } from "@osn/icons/subsquare";

export default function SubScanAccountLink({ address }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  if (!integrations?.subscan) {
    return null;
  }

  const domain = integrations.subscan.domain || chain;

  return (
    <IconLink
      href={`https://${domain}.subscan.io/account/${address}`}
      icon={<LinkSubscan className="w-5 h-5" />}
    />
  );
}
