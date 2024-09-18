import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconAcalaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcalaDark"),
);
const ProjectIconAcalaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcalaLight"),
);
const ProjectLogoAcalaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcalaDark"),
);
const ProjectLogoAcalaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcalaLight"),
);

const DEFAULT_ACALA_NODES = [
  {
    name: "Acala Foundation 0",
    url: "wss://acala-rpc-0.aca-api.network",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://acala-rpc-1.aca-api.network",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://acala-rpc-3.aca-api.network/ws",
  },
  {
    name: "Dwellir",
    url: "wss://acala-rpc.dwellir.com",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-acala.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://acala-polkadot.api.onfinality.io/public-ws",
  },
  // {
  //   name: "Polkawallet 0",
  //   url: "wss://acala.polkawallet.io/",
  // },
  // {
  //   name: "Acala Foundation 2",
  //   url: "wss://acala-rpc-2.aca-api.network/ws",
  // },
];

const links = [
  {
    name: "website",
    url: "https://acala.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/AcalaNetwork",
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

const acala = {
  value: "acala",
  name: "Acala",
  identity: "polkadot",
  symbol: "ACA",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 10,
  endpoints: DEFAULT_ACALA_NODES,
  avatar: ProjectIconAcalaLight,
  darkAvatar: ProjectIconAcalaDark,
  navLogo: ProjectLogoAcalaLight,
  navLogoDark: ProjectLogoAcalaDark,
  links,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://acala.discourse.group",
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [...defaultPostLabels, PostLabel.Financial],
  hasSubscan: true,
  noIdentityModule: true,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "acala",
  description: "Cross-chain DeFi Hub for Polkadot, Kusama and beyond.",
  modules: mergeChainModules({
    treasury: true,
    financialCouncil: true,
  }),
  cssVarsLight: {
    theme100: "rgba(100,90,255,0.10)",
    theme300: "rgba(100,90,255,0.40)",
    theme500: "rgba(100,90,255,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(100,90,255,0.10)",
    theme300: "rgba(100,90,255,0.40)",
    theme500: "rgba(100,90,255,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  multisigWallets: {
    signet: true,
  },
};

export default acala;
