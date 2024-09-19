import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { difference } from "lodash-es";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconKintsugiDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKintsugiDark"),
);
const ProjectIconKintsugiLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKintsugiLight"),
);
const ProjectLogoKintsugiDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoKintsugiDark"),
);

const DEFAULT_KINTSUGI_NODES = [
  {
    name: "Kintsugi Labs",
    url: "wss://api-kusama.interlay.io/parachain",
  },
  {
    name: "OnFinality",
    url: "wss://kintsugi.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://kintsugi-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://parachains.info/details/kintsugi/",
  },
  {
    name: "telegram",
    url: "https://t.me/interlay_community",
  },
  {
    name: "twitter",
    url: "https://twitter.com/kintsugi_btc",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/interlay",
  },
  {
    name: "medium",
    url: "https://interlay.medium.com/",
  },
  {
    name: "github",
    url: "https://github.com/interlay/interbtc",
  },
];

const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  identity: "kintsugi",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 2092,
  endpoints: DEFAULT_KINTSUGI_NODES,
  avatar: ProjectIconKintsugiLight,
  darkAvatar: ProjectIconKintsugiDark,
  navLogo: ProjectLogoKintsugiDark,
  navLogoDark: ProjectLogoKintsugiDark,
  navPreferDark: true,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.Council]),
  hasSubscan: true,
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
  multisigWallets: {
    signet: true,
  },
};

export default kintsugi;
