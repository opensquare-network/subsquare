import getChainSettings from "./settings";

export function isAssetHubMigrated() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const setting = getChainSettings(chain);
  return setting.assetHubMigrated ?? false;
}
