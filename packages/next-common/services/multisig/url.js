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
