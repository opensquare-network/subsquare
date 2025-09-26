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
    url: "wss://zkverify-volta.nirvanalabs.xyz/VoltaSubSquare-mhq7r?apikey=0d7c82be-b75c-4eca-a086-5d70c64705f7",
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

export default zkverifyTestnet;
