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
    url: "wss://zkverify-rpc.zkverify.io",
  },
];

const zkverify = {
  ...zkverifyCommonSettings,
  value: Chains.zkverify,
  name: "ZKVerify",
  identity: Chains.zkverify,
  symbol: "VFY",
  ss58Format: 8741,
  endpoints: DEFAULT_ZKVERIFY_NODES,
  links: zkverifyLinks,
  group: MenuGroups.Solochain,
  modules: zkverifyModules,
  integrations: zkverifyIntegrations,
  referendaActions: {
    startFrom: 0,
  },
  ...zkverifyThemeVars,
};

export default zkverify;
