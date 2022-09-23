import Logo from "../../../assets/header-logos/polkadex.svg";
import DarkModeLogo from "../../../assets/header-logos/polkadex-dark.svg";
import Avatar from "../../../assets/icons/chain/polkadex.png";
import DarkAvatar from "../../../assets/icons/chain/polkadex-dark.png";
import OptionGroups from "./menuGroups";

const DEFAULT_POLKADEX_NODES = [
  {
    name: "Polkadex",
    url: "wss://mainnet.polkadex.trade/",
  },
  {
    name: "Polkadex-JP",
    url: "wss://mainnet-jp-1.polkadex.trade",
  },
  {
    name: "OnFinality",
    url: "wss://polkadex.api.onfinality.io/public-ws",
  },
];

const polkadex = {
  value: "polkadex",
  name: "Polkadex",
  icon: "polkadex.svg",
  identity: "polkadex",
  symbol: "PDEX",
  decimals: 12,
  hasElections: true,
  ss58Format: 88,
  blockTime: 6000,
  snsCoverCid: "bafybeickjkgii2nnhwyypiem6jjj3z75u4dfknwcmedru4ytzv6qddfg5y",
  endpoints: DEFAULT_POLKADEX_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: OptionGroups.Mainnet,
};

export default polkadex;
