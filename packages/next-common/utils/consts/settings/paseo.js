import Chains from "../chains";
import capitalize from "../../capitalize";
import dynamic from "next/dynamic";
import { defaultPostLabels } from "./common";
import { mergeChainModules } from "./common/modules";
import {
  paseoLinks,
  paseoThemeVars,
  paseoCommonSettings,
} from "./common/paseo";

const ProjectIconPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoDark"),
);
const ProjectIconPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoLight"),
);

const nodes = [
  {
    name: "Amforc",
    url: "wss://paseo.rpc.amforc.com",
  },
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/paseo",
  },
  {
    name: "StakeWorld",
    url: "wss://pas-rpc.stakeworld.io",
  },
  {
    name: "Dwellir",
    url: "wss://paseo-rpc.dwellir.com",
  },
  {
    name: "IBP2",
    url: "wss://paseo.dotters.network",
  },
];

const paseo = {
  ...paseoCommonSettings,
  value: Chains.paseo,
  name: capitalize(Chains.paseo),
  blockTime: 6000,
  endpoints: nodes,
  avatar: ProjectIconPaseoLight,
  darkAvatar: ProjectIconPaseoDark,
  navPreferDark: true,
  links: paseoLinks,
  hasMultisig: true,
  multisigApiPrefix: "paseo",
  graphqlApiSubDomain: "paseo-gh-api",
  postLabels: defaultPostLabels,
  description:
    "The new Polkadot testnet replacing Rococo. Paseo is decentralised, stable, and community run.",
  modules: mergeChainModules({
    referenda: true,
    fellowship: false,
    treasury: {
      spends: true,
      childBounties: true,
      tips: false,
    },
    council: false,
    democracy: false,
    technicalCommittee: false,
    assethub: true,
  }),
  integrations: {
    subscan: true,
  },
  sima: true,
  ...paseoThemeVars,
  multisigWallets: {
    mimir: true,
  },
};

export default paseo;
