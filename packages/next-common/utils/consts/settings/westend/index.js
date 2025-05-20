import dynamic from "next/dynamic";
import { defaultPostLabels } from "next-common/utils/consts/settings/common";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import capitalize from "../../../capitalize";
import Chains from "../../chains";
import { westendRelayChainNodes, westendAssetHubNodes } from "./nodes";
import { mergeChainModules } from "../common/modules";
import westendCommonCfg from "next-common/utils/consts/settings/westend/common";

const ProjectIconWestendDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendDark"),
);
const ProjectIconWestendLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendLight"),
);

const name = Chains.westend;

const westend = {
  value: name,
  name: capitalize(name),
  ...westendCommonCfg,
  blockTime: 6000,
  assetHubMigrated: true,
  endpoints: westendAssetHubNodes,
  relayChainEndpoints: westendRelayChainNodes,
  avatar: ProjectIconWestendLight,
  darkAvatar: ProjectIconWestendDark,
  group: MenuGroups.WestendAndParachains,
  links: polkadotLinks,
  postLabels: defaultPostLabels,
  description: "Westend is the primary test network of Polkadot.",
  modules: mergeChainModules({
    referenda: true,
    democracy: false,
    council: false,
    technicalCommittee: false,
    assethub: true,
    people: true,
    vesting: true,
  }),
  integrations: {
    subscan: true,
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
  sima: true,
  supportWalletconnect: true,
  allowWeb2Login: true,
};

export default westend;
