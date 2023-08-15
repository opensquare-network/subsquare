import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconBifrostKusamaDark,
  ProjectIconBifrostKusamaLight,
  ProjectLogoBifrostKusamaDark,
} from "@osn/icons/subsquare";

const DEFAULT_BIFROST_NODES = [
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Liebi",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Dwellir",
    url: "wss://bifrost-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://bifrost.finance/",
  },
  {
    name: "github",
    url: "https://github.com/bifrost-finance",
  },
  {
    name: "twitter",
    url: "https://twitter.com/BifrostFinance",
  },
  {
    name: "telegram",
    url: "https://t.me/bifrost_finance",
  },
  {
    name: "discord",
    url: "https://discord.gg/8DRBw2h5X4",
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
  hasElections: false,
  ss58Format: 6,
  snsCoverCid: "bafybeianzspawke2pll23iovv6jarictrqdpmptdp4o2eevmo2hnpe3lea",
  endpoints: DEFAULT_BIFROST_NODES,
  avatar: ProjectIconBifrostKusamaLight,
  darkAvatar: ProjectIconBifrostKusamaDark,
  navLogo: ProjectLogoBifrostKusamaDark,
  navLogoDark: ProjectLogoBifrostKusamaDark,
  links,
  group: MenuGroups.KusamaAndParachains,
  subscanDomain: "bifrost-kusama",
  postLabels: defaultPostLabels,
  hasSubscan: true,
  hasReferenda: true,
  hasFellowship: true,
  showReferendaReferendumDelegationPercentage: true,
  description:
    "Provide LSD for 9+ blockchains and beyond, dedicated layer-1 built on Substrate with XCM for cross-chain staking.",
  useVoteCall: true,
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
};

export default bifrost;
