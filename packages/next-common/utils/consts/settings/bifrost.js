import Logo from "../../../assets/header-logos/bifrost.svg";
import DarkModeLogo from "../../../assets/header-logos/bifrost-dark.svg";
import Avatar from "../../../assets/icons/chain/bifrost.png";
import OptionGroups from "./menuGroups";

const DEFAULT_BIFROST_NODES = [
  {
    name: "OnFinality",
    url: "wss://bifrost-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Liebi 0",
    url: "wss://bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Liebi 1",
    url: "wss://us.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Liebi 2",
    url: "wss://us.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "Dwellir",
    url: "wss://bifrost-rpc.dwellir.com",
  },
];

const bifrost = {
  value: "bifrost",
  name: "Bifrost",
  icon: "bifrost.svg",
  hideHeight: false,
  identity: "bifrost",
  symbol: "bnc",
  decimals: 12,
  hasElections: true,
  ss58Format: 6,
  snsCoverCid: "bafybeibu7lmjymi5x6gjixdawmc4rjufruc6qwazailfnpzpoaqtuq6khe",
  endpoints: DEFAULT_BIFROST_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: OptionGroups.KusamaAndParachains,
};

export default bifrost;
