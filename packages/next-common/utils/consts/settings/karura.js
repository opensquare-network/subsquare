import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import dynamic from "next/dynamic";

const ProjectIconKaruraDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKaruraDark"),
);
const ProjectIconKaruraLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKaruraLight"),
);
const ProjectLogoKaruraDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoKaruraDark"),
);

export const DEFAULT_KARURA_NODES = [
  {
    name: "Acala Foundation 0",
    url: "wss://karura-rpc-0.aca-api.network",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://karura-rpc-1.aca-api.network",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://karura-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://karura-rpc-3.aca-api.network/ws",
  },
  // {
  //   name: "Polkawallet",
  //   url: "wss://karura.polkawallet.io",
  // },
  {
    name: "Dwellir",
    url: "wss://karura-rpc.dwellir.com",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-karura.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://karura.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://acala.network/karura",
  },
  {
    name: "twitter",
    url: "https://twitter.com/KaruraNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/acalaofficial",
  },
  {
    name: "discord",
    url: "https://www.acala.gg/",
  },
  {
    name: "github",
    url: "https://github.com/AcalaNetwork",
  },
];

const karura = {
  value: "karura",
  name: "Karura",
  identity: "kusama",
  symbol: "KAR",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 8,
  endpoints: DEFAULT_KARURA_NODES,
  avatar: ProjectIconKaruraLight,
  darkAvatar: ProjectIconKaruraDark,
  navLogo: ProjectLogoKaruraDark,
  navLogoDark: ProjectLogoKaruraDark,
  navPreferDark: true,
  links,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://acala.discourse.group",
  group: MenuGroups.KusamaAndParachains,
  postLabels: [...defaultPostLabels, PostLabel.Financial],
  hasSubscan: true,
  noIdentityModule: true,
  useVoteCall: true,
  description: "Cross-chain DeFi Hub for Polkadot, Kusama and beyond.",
  modules: {
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(229,15,89,0.10)",
    theme300: "rgba(229,15,89,0.40)",
    theme500: "rgba(229,15,89,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(229,15,89,0.10)",
    theme300: "rgba(229,15,89,0.40)",
    theme500: "rgba(229,15,89,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  multisigWallets: {
    signet: true,
  },
};

export default karura;
