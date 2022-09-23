import Logo from "../../../assets/header-logos/karura.svg";
import DarkModeLogo from "../../../assets/header-logos/karura-dark.svg";
import Avatar from "../../../assets/icons/chain/karura.png";
import MenuGroups from "./menuGroups";

export const DEFAULT_KARURA_NODES = [
  {
    name: "OnFinality",
    url: "wss://karura.api.onfinality.io/public-ws",
  },
  {
    name: "Polkawallet",
    url: "wss://karura.polkawallet.io",
  },
  {
    name: "Acala Foundation 0",
    url: "wss://karura-rpc-0.aca-api.network",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://karura-rpc-1.aca-api.network",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://karura-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://karura-rpc-3.aca-api.network/ws",
  },
];

const karura = {
  value: "karura",
  name: "Karura",
  identity: "kusama",
  symbol: "KAR",
  decimals: 12,
  hasElections: false,
  ss58Format: 8,
  snsCoverCid: "bafybeiaoq7r32qsnpjqcey3x5hxfikbq3artjzi32he7dkretvesqgf3ny",
  endpoints: DEFAULT_KARURA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.KusamaAndParachains,
};

export default karura;
