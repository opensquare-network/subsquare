import Avatar from "../../../assets/icons/chain/polkadex.png";
import DarkAvatar from "../../../assets/icons/chain/polkadex-dark.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

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
  identity: "polkadex",
  symbol: "PDEX",
  decimals: 12,
  hasElections: true,
  ss58Format: 88,
  blockTime: 6000,
  endpoints: DEFAULT_POLKADEX_NODES,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description:
    "Trade crypto with fully decentralized peer-to-peer orderbook based trading engine for Web3. Polkadex Orderbook - the CEXiest DEX in DeFi.",
};

export default polkadex;
