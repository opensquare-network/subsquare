import Logo from "../../../assets/header-logos/bifrost-polkadot.svg";
import DarkModeLogo from "../../../assets/header-logos/bifrost-polkadot-dark.svg";
import Avatar from "../../../assets/icons/chain/bifrost-polkadot.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectLogoBifrostPolkadotDark,
  ProjectLogoBifrostPolkadotLight,
} from "@osn/icons/subsquare";
import bifrost from "./bifrost";

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

const links = bifrost.links;

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
  description: "Provide LSD for 9+ blockchains and beyond, dedicated layer-1 built on Substrate with XCM for cross-chain staking.",
};

export default bifrostPolkadot;
