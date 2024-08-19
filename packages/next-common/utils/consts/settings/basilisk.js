import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";

const ProjectIconBasiliskDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBasiliskDark"),
);
const ProjectIconBasiliskLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBasiliskLight"),
);
const ProjectLogoBasiliskDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoBasiliskDark"),
);

const DEFAULT_BASILISK_NODES = [
  {
    name: "Basilisk",
    url: "wss://rpc.basilisk.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://basilisk-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://bsx.fi",
  },
  {
    name: "twitter",
    url: "https://twitter.com/bsx_finance",
  },
  {
    name: "telegram",
    url: "https://t.me/bsx_fi",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/S8YZj5aXR6",
  },
  {
    name: "github",
    url: "https://github.com/galacticcouncil",
  },
  {
    name: "reddit",
    url: "https://www.reddit.com/r/bsx_fi/",
  },
];

const basilisk = {
  value: "basilisk",
  name: "Basilisk",
  identity: "basilisk",
  symbol: "BSX",
  decimals: 12,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 10041,
  snsCoverCid: "bafybeicxl7g3sjtq2bflm4itrxwlibbt3jhwybf24fex4hf3hyuwbbeawy",
  snsCoverSmallCid: "QmcYuex9WCaNTEgLNVgzHF9Bt8n7dU4sSHEo44oNtBwE9B",
  avatar: ProjectIconBasiliskLight,
  darkAvatar: ProjectIconBasiliskDark,
  navLogo: ProjectLogoBasiliskDark,
  navLogoDark: ProjectLogoBasiliskDark,
  navPreferDark: true,
  endpoints: DEFAULT_BASILISK_NODES,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  useVoteCall: true,
  description:
    "Snek brings permissionless liquidity to the Kusama ecosystem. Swap tokens, flip NFTs and earn rewards. Help young crypto projects bootstrap liquidity and receive tokens.",
  modules: {
    democracy: true,
    referenda: true,
  },
  cssVarsLight: {
    theme100: "rgba(63,227,154,0.10)",
    theme300: "rgba(63,227,154,0.40)",
    theme500: "rgba(63,227,154,1)",
    navigationBg: "rgba(26,32,35,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.06)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(63,227,154,0.10)",
    theme300: "rgba(63,227,154,0.40)",
    theme500: "rgba(63,227,154,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "rgba(39,42,58,1)",
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
};

export default basilisk;
