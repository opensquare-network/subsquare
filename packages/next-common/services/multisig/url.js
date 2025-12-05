import getChainSettings from "next-common/utils/consts/settings";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";
import Chains from "next-common/utils/consts/chains";

export default function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  if (isAssetHubMigrated() || chain === Chains.hyperBridge) {
    return `https://${settings.multisigApiPrefix}.statescan.io/graphql`;
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}

export function getRelayChainMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.relayChainMultisigApiPrefix || !isAssetHubMigrated()) {
    return null;
  }

  return `https://${settings.relayChainMultisigApiPrefix}.statescan.io/graphql`;
}
