import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";

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

const shibuya = {
  value: Chains.shibuya,
  name: capitalize(Chains.shibuya),
  identity: Chains.shibuya,
  symbol: "SBY",
  decimals: 18,
  blockTime: 12000,
  ss58Format: 5,
  snsCoverCid: "QmQtwn8aLPLe3TifbZRt6eUuRjbLUaudcmg83hzqUMPT8p",
  snsCoverSmallCid: "QmXs3Mig8szGqdU5BGzb4KtCC7zSJFT8ibzfoQqwDnSXay",
  endpoints: nodes,
  avatar: ProjectIconShibuyaLight,
  darkAvatar: ProjectIconShibuyaDark,
  navLogo: ProjectLogoShibuyaLight,
  navLogoDark: ProjectLogoShibuyaDark,
  navPreferDark: true,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  hasDiscussions: true,
  hasTechComm: true,
  hasTipsModule: false,
  description: "Shibuya is the testnet of Shiden (a sister chain of Astar).",
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

export default shibuya;
