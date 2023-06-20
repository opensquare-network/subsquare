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
  group: MenuGroups.KusamaAndParachains,
  subscanDomain: "bifrost-kusama",
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default bifrost;
