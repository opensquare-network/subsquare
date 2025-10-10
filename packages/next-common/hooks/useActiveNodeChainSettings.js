import { useMemo } from "react";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import {
  useChainSettings,
  useRelayChainSettings,
} from "next-common/context/chain";

export default function useActiveNodeChainSettings() {
  const chainSettings = useChainSettings();
  const relayChainSettings = useRelayChainSettings();

  return useMemo(
    () => (isAssetHubMigrated() ? relayChainSettings : chainSettings),
    [relayChainSettings, chainSettings],
  );
}
