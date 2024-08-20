import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { difference } from "lodash-es";
import dynamic from "next/dynamic";

const ProjectIconAltairDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAltairDark"),
);
const ProjectIconAltairLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAltairLight"),
);
const ProjectLogoAltairDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAltairDark"),
);

const nodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.altair.centrifuge.io",
  },
  {
    name: "OnFinality",
    url: "wss://altair.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "twitter",
    url: "https://twitter.com/altair_network",
  },
  {
    name: "medium",
    url: "https://medium.com/altair-network",
  },
];

const altair = {
  value: Chains.altair,
  name: capitalize(Chains.altair),
  identity: Chains.altair,
  symbol: "AIR",
  decimals: 18,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 136,
  endpoints: nodes,
  avatar: ProjectIconAltairLight,
  darkAvatar: ProjectIconAltairDark,
  navLogo: ProjectLogoAltairDark,
  navLogoDark: ProjectLogoAltairDark,
  navPreferDark: true,
  links,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://gov.centrifuge.io",
  group: MenuGroups.KusamaAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.TechComm]),
  hasSubscan: true,
  hasDiscussions: false,
  hasTechComm: false,
  hasTipsModule: false,
  description:
    "The home for financing assets on Kusama. Powered by Centrifuge.",
  modules: {
    democracy: true,
    referenda: true,
  },
  cssVarsLight: {
    theme100: "rgba(255,192,18,0.10)",
    theme300: "rgba(255,192,18,0.40)",
    theme500: "rgba(255,192,18,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(255,192,18,0.10)",
    theme300: "rgba(255,192,18,0.40)",
    theme500: "rgba(255,192,18,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
};

export default altair;
