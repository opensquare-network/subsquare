import Logo from "../../../assets/header-logos/bifrost-polkadot.svg";
import DarkModeLogo from "../../../assets/header-logos/bifrost-polkadot-dark.svg";
import Avatar from "../../../assets/icons/chain/bifrost-polkadot.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectLogoBifrostPolkadotDark,
  ProjectLogoBifrostPolkadotLight,
} from "@osn/icons/subsquare";

const DEFAULT_NODES = [
  {
    name: "Liebi",
    url: "wss://hk.p.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "OnFinality",
    url: "wss://bifrost-polkadot.api.onfinality.io/public-ws",
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

const bifrostPolkadot = {
  value: "bifrost-polkadot",
  name: "Bifrost Polkadot",
  hideHeight: false,
  identity: "bifrost-polkadot",
  symbol: "bnc",
  decimals: 12,
  hasElections: false,
  ss58Format: 6,
  snsCoverCid: "bafybeicykjzlwi3rjs637txy4fn2m6qbjofjwlypgmthbbb7i3f522xjzy",
  endpoints: DEFAULT_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoBifrostPolkadotLight,
  navLogoDark: ProjectLogoBifrostPolkadotDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  subscanDomain: "bifrost",
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default bifrostPolkadot;
