import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";
import { astarLinks, astarThemeVars } from "./common/astar";
import { defaultPostLabels } from "./common";
import { mergeChainModules } from "./common/modules";

const ProjectIconShibuyaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconShibuyaDark"),
);
const ProjectIconShibuyaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconShibuyaLight"),
);
const ProjectLogoShibuyaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoShibuyaDark"),
);
const ProjectLogoShibuyaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoShibuyaLight"),
);

const nodes = [
  {
    name: "Astar",
    url: "wss://rpc.shibuya.astar.network",
  },
  {
    name: "Dwellir",
    url: "wss://shibuya-rpc.dwellir.com",
  },
];

const shibuya = {
  value: Chains.shibuya,
  name: capitalize(Chains.shibuya),
  identity: Chains.shibuya,
  symbol: "SBY",
  decimals: 18,
  blockTime: 12000,
  ss58Format: 5,
  endpoints: nodes,
  avatar: ProjectIconShibuyaLight,
  darkAvatar: ProjectIconShibuyaDark,
  navLogo: ProjectLogoShibuyaLight,
  navLogoDark: ProjectLogoShibuyaDark,
  navPreferDark: true,
  links: astarLinks,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  hasDiscussions: true,
  description: "Shibuya is the testnet of Shiden (a sister chain of Astar).",
  modules: mergeChainModules({
    treasury: {
      bounties: false,
      tips: false,
    },
    communityCouncil: true,
    communityTreasury: true,
    technicalCommittee: true,
  }),
  showNewTreasuryProposalButton: true,

  ...astarThemeVars,
};

export default shibuya;
