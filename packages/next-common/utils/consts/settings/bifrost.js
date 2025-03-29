import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconBifrostKusamaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBifrostKusamaDark"),
);
const ProjectIconBifrostKusamaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBifrostKusamaLight"),
);
const ProjectLogoBifrostKusamaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoBifrostKusamaDark"),
);

const DEFAULT_BIFROST_NODES = [
  {
    name: "Dwellir",
    url: "wss://bifrost-rpc.dwellir.com",
  },
  {
    name: "Liebi",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
  {
    name: "LiebiUS",
    url: "wss://us.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://bifrost.io/",
  },
  {
    name: "dapp",
    url: "https://app.bifrost.io/",
  },
  {
    name: "github",
    url: "https://github.com/bifrost-io",
  },
  {
    name: "twitter",
    url: "https://x.com/Bifrost",
  },
  {
    name: "telegram",
    url: "https://t.me/bifrost_io",
  },
  {
    name: "discord",
    url: "https://discord.bifrost.io/",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@bifrostio/videos",
  },
  {
    name: "medium",
    url: "https://medium.com/bifrost-finance",
  },
];

const bifrost = {
  value: "bifrost",
  domain: "bifrost-kusama",
  name: "Bifrost Kusama",
  hideHeight: false,
  identity: "bifrost",
  symbol: "BNC",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 0,
  endpoints: DEFAULT_BIFROST_NODES,
  avatar: ProjectIconBifrostKusamaLight,
  darkAvatar: ProjectIconBifrostKusamaDark,
  navLogo: ProjectLogoBifrostKusamaDark,
  navLogoDark: ProjectLogoBifrostKusamaDark,
  navPreferDark: true,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  description: "The Liquid Staking Standard for Any Chain.",
  modules: mergeChainModules({
    referenda: true,
    fellowship: true,
    treasury: {
      spends: true,
      bounties: false,
      tips: false,
    },
    vesting: true,
    democracy: {
      archived: true,
    },
    council: {
      archived: true,
    },
    technicalCommittee: {
      archived: true,
    },
  }),
  integrations: {
    subscan: {
      domain: "bifrost-kusama",
    },
  },
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "kbnc",
  cssVarsLight: {
    theme100: "rgba(84,43,251,0.10)",
    theme300: "rgba(84,43,251,0.40)",
    theme500: "rgba(84,43,251,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(84,43,251,0.10)",
    theme300: "rgba(84,43,251,0.40)",
    theme500: "rgba(84,43,251,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
};

export default bifrost;
