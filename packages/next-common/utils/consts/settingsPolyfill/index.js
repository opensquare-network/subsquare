import getChainSettings from "../settings";
import Chainspolyfill from "./chainsPolyfill";
import kusamaBridge from "./kusamaBridge";
import polkadotBridge from "./polkadotBridge";

const settingsPolyfillMap = {
  [Chainspolyfill.kusamaBridge]: kusamaBridge,
  [Chainspolyfill.polkadotBridge]: polkadotBridge,
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
