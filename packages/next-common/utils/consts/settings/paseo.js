import Chains from "../chains";
import capitalize from "../../capitalize";
import dynamic from "next/dynamic";
import { defaultPostLabels } from "./common";
import { mergeChainModules } from "./common/modules";
import {
  paseoLinks,
  paseoThemeVars,
  paseoCommonSettings,
  paseoAssethubMigration,
  paseoRelayChainNodes,
  paseoAssetHubNodes,
} from "./common/paseo";
import polkadotPreimageSettings from "next-common/utils/consts/settings/common/preimage/polkadot";

const ProjectIconPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoDark"),
);
const ProjectIconPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoLight"),
);

const paseo = {
  ...paseoCommonSettings,
  value: Chains.paseo,
  name: capitalize(Chains.paseo),
  blockTime: 6000,
  assethubBlockTime: 12000,
  endpoints: paseoAssetHubNodes,
  relayChainEndpoints: paseoRelayChainNodes,
  assethubMigration: paseoAssethubMigration,
  avatar: ProjectIconPaseoLight,
  darkAvatar: ProjectIconPaseoDark,
  navPreferDark: true,
  links: paseoLinks,
  hasMultisig: true,
  multisigApiPrefix: "ahs-gh-api",
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
    people: true,
    vesting: true,
  }),
  integrations: {
    statescan: true,
    subscan: true,
  },
  sima: true,
  ...paseoThemeVars,
  multisigWallets: {
    mimir: true,
  },
  allowWeb2Login: true,
  preimage: polkadotPreimageSettings,
  hideHeight: true,
  vaultWalletConfig: {
    relayChainGenesisHash:
      "0x77afd6190f1554ad45fd0d31aee62aacc33c6db0ea801129acb813f913e0764f",
  },
};

export default paseo;
