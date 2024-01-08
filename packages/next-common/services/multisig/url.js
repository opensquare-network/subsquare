import getChainSettings from "next-common/utils/consts/settings";

export default function getMultisigApiUrl(chain) {
  const settings = getChainSettings(chain);
  if (!settings?.multisigApiPrefix) {
    throw new Error(`Can not find multisig settings for ${chain}`);
  }

  return `https://${settings.multisigApiPrefix}-multisig-api.statescan.io/graphql`;
}
