import Logo from "../../../assets/header-logos/crab.svg";
import DarkModeLogo from "../../../assets/header-logos/crab-dark.svg";
import Avatar from "../../../assets/icons/chain/crab.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import OptionGroups from "./menuGroups";

const DEFAULT_CRAB_NODES = [
  {
    name: "OnFinality",
    url: "wss://darwinia-crab.api.onfinality.io/public-ws",
  },
  {
    name: "Darwinia",
    url: "wss://crab-rpc.darwinia.network",
  },
  {
    name: "Dwellir",
    url: "wss://darwiniacrab-rpc.dwellir.com",
  },
];

const crab = {
  value: Chains.crab,
  name: capitalize(Chains.crab),
  icon: "crab.svg",
  identity: Chains.crab,
  symbol: "CRAB",
  decimals: 9,
  hasElections: true,
  ss58Format: 42,
  blockTime: 6000,
  snsCoverCid: "bafybeihxlzbqo54y5llxp4p5kd77bgxpgjppfk33gfgdbo6kjraxclefcu",
  endpoints: DEFAULT_CRAB_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: OptionGroups.KusamaAndParachains,
};

export default crab;
