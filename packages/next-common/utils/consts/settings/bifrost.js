import Logo from "../../../assets/header-logos/bifrost-kusama.svg";
import DarkModeLogo from "../../../assets/header-logos/bifrost-kusama-dark.svg";
import Avatar from "../../../assets/icons/chain/bifrost-kusama.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoBifrostKusamaDark } from "@osn/icons/subsquare";

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
  name: "Bifrost Kusama",
  hideHeight: false,
  identity: "bifrost",
  symbol: "bnc",
  decimals: 12,
  hasElections: false,
  ss58Format: 6,
  snsCoverCid: "bafybeianzspawke2pll23iovv6jarictrqdpmptdp4o2eevmo2hnpe3lea",
  endpoints: DEFAULT_BIFROST_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
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
  description: "The Bifrost Network is an EVM-compatible blockchain open to everyone.",
};

export default bifrost;
