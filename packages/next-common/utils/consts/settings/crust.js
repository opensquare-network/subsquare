import Logo from "../../../assets/header-logos/crust.svg";
import DarkModeLogo from "../../../assets/header-logos/crust-dark.svg";
import Avatar from "../../../assets/icons/chain/crust.png";
import DarkAvatar from "../../../assets/icons/chain/crust-dark.png";

import Chains from "../chains";
import capitalize from "../../capitalize";

const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws",
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network",
  },
  {
    name: "Decoo Technologies",
    url: "wss://rpc-crust-mainnet.decoo.io",
  },
  {
    name: "DCloud Foundation",
    url: "wss://api.decloudf.com",
  },
];

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  icon: "crust.svg",
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
  ss58Format: 66,
  blockTime: 6000,
  snsCoverCid: "bafybeicb77dwocjcssmcb75irbsvxly4ep335pky2r7tvwsjnoyzpl3c3y",
  endpoints: DEFAULT_CRUST_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
};

export default crust;
