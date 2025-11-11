import getChainSettings from "next-common/utils/consts/settings";
import { isAssetHubMigrated } from "next-common/utils/consts/isAssetHubMigrated";

export default function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  if (isAssetHubMigrated(chain)) {
    return `https://${settings.multisigApiPrefix}.statescan.io/graphql`;
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}

export function getRelayChainMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.relayChainMultisigApiPrefix || !settings?.assetHubMigration) {
    return null;
  }

  return `https://${settings.relayChainMultisigApiPrefix}.statescan.io/graphql`;
}
