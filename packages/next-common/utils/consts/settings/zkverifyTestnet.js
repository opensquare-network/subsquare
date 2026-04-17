import Chains from "../chains";
import MenuGroups from "./menuGroups";
import {
  zkverifyCommonSettings,
  zkverifyThemeVars,
  zkverifyLinks,
  zkverifyModules,
  zkverifyIntegrations,
} from "./common/zkverify";

const DEFAULT_ZKVERIFY_NODES = [
  {
    name: "ZKVerify",
    url: "wss://zkverify-volta-rpc.zkverify.io",
  },
];

const zkverifyTestnet = {
  ...zkverifyCommonSettings,
  value: Chains.zkverifyTestnet,
  name: "ZKVerify Testnet",
  identity: Chains.zkverifyTestnet,
  symbol: "tVFY",
  endpoints: DEFAULT_ZKVERIFY_NODES,
  links: zkverifyLinks,
  group: MenuGroups.Testnet,
  modules: zkverifyModules,
  integrations: zkverifyIntegrations,
  ...zkverifyThemeVars,
};

export default zkverifyTestnet;
