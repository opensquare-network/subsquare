import getChainSettings from "../settings";
import Chainspolyfill from "./chainsPolyfill";
import kusamaBridge from "./kusamaBridge";
import polkadotBridge from "./polkadotBridge";
import polkadotBulletin from "./polkadotBulletin";

const settingsPolyfillMap = {
  [Chainspolyfill.kusamaBridge]: kusamaBridge,
  [Chainspolyfill.polkadotBridge]: polkadotBridge,
  [Chainspolyfill.polkadotBulletin]: polkadotBulletin,
};

// Provides configuration for some unsupported chains
export const getChainSettingsPolyfill = (chain, blockHeight = null) => {
  const settingPolyfill = settingsPolyfillMap[chain];
  if (settingPolyfill) {
    return { ...settingPolyfill };
  } else {
    return getChainSettings(chain, blockHeight);
  }
};
