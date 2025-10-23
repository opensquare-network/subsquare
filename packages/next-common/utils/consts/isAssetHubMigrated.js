import getChainSettings from "./settings";

export function isAssetHubMigrated() {
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const settings = getChainSettings(chain);
  return !!settings.assethubMigration;
}
