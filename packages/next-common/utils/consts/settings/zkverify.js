import Chains from "../chains";
import { mergeChainModules } from "./common/modules";
import MenuGroups from "./menuGroups";
import {
  zkverifyCommonSettings,
  zkverifyThemeVars,
  zkverifyLinks,
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
  endpoints: DEFAULT_ZKVERIFY_NODES,
  links: zkverifyLinks,
  group: MenuGroups.Solochain,
  modules: mergeChainModules({
    democracy: false,
    referenda: true,
    treasury: false,
    council: false,
    technicalCommittee: false,
  }),
  integrations: {
    subscan: true,
  },
  ...zkverifyThemeVars,
};

export default zkverify;
