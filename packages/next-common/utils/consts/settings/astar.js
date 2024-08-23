import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";

const ProjectIconAstarDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAstarDark"),
);
const ProjectIconAstarLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAstarLight"),
);
const ProjectLogoAstarDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAstarDark"),
);
const ProjectLogoAstarLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAstarLight"),
);

const nodes = [
  {
    name: "Astar",
    url: "wss://rpc.astar.network",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/astr",
  },
  {
    name: "Blast",
    url: "wss://astar.public.blastapi.io",
  },
  {
    name: "Dwellir",
    url: "wss://astar-rpc.dwellir.com",
  },
  {
    name: "OnFinality",
    url: "wss://astar.api.onfinality.io/public-ws",
  },
  {
    name: "RadiumBlock",
    url: "wss://astar.public.curie.radiumblock.co/ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://astar.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/AstarNetwork",
  },
  {
    name: "discord",
    url: "https://discord.gg/astarnetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/PlasmOfficial",
  },
  {
    name: "github",
    url: "https://github.com/AstarNetwork",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/c/AstarNetwork",
  },
];

const astar = {
  value: Chains.astar,
  name: capitalize(Chains.astar),
  identity: Chains.astar,
  symbol: "ASTR",
  decimals: 18,
  blockTime: 12000,
  ss58Format: 5,
  endpoints: nodes,
  avatar: ProjectIconAstarLight,
  darkAvatar: ProjectIconAstarDark,
  navLogo: ProjectLogoAstarLight,
  navLogoDark: ProjectLogoAstarDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  hasDiscussions: true,
  hasTechComm: true,
  hasTipsModule: false,
  description: "A Scalable Network Powering a Global Web3 Vision for All.",
  modules: {
    democracy: true,
    referenda: false,
  },
  cssVarsLight: {
    theme100: "rgba(0,117,255,0.10)",
    theme300: "rgba(0,117,255,0.40)",
    theme500: "rgba(0,117,255,1)",
    navigationBg: "rgba(2,6,23,1)",
    navigationActive: "rgba(255,255,255,0.06)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(0,117,255,0.10)",
    theme300: "rgba(0,117,255,0.40)",
    theme500: "rgba(0,117,255,1)",
    navigationBg: "rgba(2,6,23,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default astar;
