import { useChain, useChainSettings } from "next-common/context/chain";
import IconLink from "./iconLink";
import { LinkSubscan } from "@osn/icons/subsquare";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import { isRelayChain } from "next-common/utils/chain";
import { useMemo } from "react";

function SubScanAccountLinkWrapper({ children }) {
  const { integrations } = useChainSettings();
  if (!integrations?.subscan) {
    return null;
  }

  return children;
}

function SubScanAccountLinkImpl({ address }) {
  const chain = useChain();
  const { integrations } = useChainSettings();
  const domain = useMemo(() => {
    if (isRelayChain(chain) && isAssetHubMigrated()) {
      return `assethub-${chain}`;
    }

    return integrations?.subscan?.domain || chain;
  }, [chain, integrations]);

  return (
    <IconLink
      href={`https://${domain}.subscan.io/account/${address}`}
      icon={<LinkSubscan className="w-5 h-5" />}
    />
  );
}

export default function SubScanAccountLink({ address }) {
  return (
    <SubScanAccountLinkWrapper>
      <SubScanAccountLinkImpl address={address} />
    </SubScanAccountLinkWrapper>
  );
}
