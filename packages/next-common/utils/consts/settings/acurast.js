import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { difference } from "lodash-es";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconKintsugiDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcurastDark"),
);
const ProjectIconKintsugiLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAcurastLight"),
);
const ProjectLogoKintsugiDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcurastDark"),
);
const ProjectLogoKintsugiLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAcurastLight"),
);

const endpoints = [
  {
    name: "Acurast",
    url: "wss://public-archive.mainnet.acurast.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://acurast.com",
  },
  {
    name: "telegram",
    url: "https://t.me/acurastnetwork",
  },
  {
    name: "twitter",
    url: "https://x.com/@acurast",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/acurast",
  },
  {
    name: "github",
    url: "https://github.com/acurast",
  },
];

const kintsugi = {
  value: "acurast",
  name: "Acurast",
  identity: "acurast",
  symbol: "ACU",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 42,
  endpoints,
  avatar: ProjectIconKintsugiLight,
  darkAvatar: ProjectIconKintsugiDark,
  navLogo: ProjectLogoKintsugiLight,
  navLogoDark: ProjectLogoKintsugiDark,
  navPreferDark: true,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.Council]),
  description:
    "Make your Bitcoin work for you with Kintsugi. Use your BTC for lending, borrowing, swapping and staking.",
  useVoteCall: true,
  modules: mergeChainModules({
    democracy: {
      externalProposals: false,
    },
    treasury: {
      bounties: false,
      tips: false,
    },
    council: false,
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(247,205,69,0.10)",
    theme300: "rgba(247,205,69,0.40)",
    theme500: "rgba(247,205,69,1)",
    navigationBg: "rgba(4,19,51,1)",
    navigationActive: "rgba(255,255,255,0.06)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(247,205,69,0.10)",
    theme300: "rgba(247,205,69,0.40)",
    theme500: "rgba(247,205,69,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  wallets: {
    walletconnect: false,
  },
  multisigWallets: {
    signet: true,
  },
  allowWeb2Login: true,
};

export default kintsugi;
