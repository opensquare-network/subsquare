import Logo from "../../../assets/header-logos/polkadot.svg";
import DarkModeLogo from "../../../assets/header-logos/polkadot-dark.svg";
import Avatar from "../../../assets/icons/chain/polkadot.png";

import capitalize from "../../capitalize";
import Chains from "../chains";
import MenuGroups from "./menuGroups";

const name = Chains.polkadot;

export const defaultPolkadotNodes = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
];

const polkadot = {
  value: name,
  name: capitalize(name),
  icon: "polkadot.svg",
  identity: name,
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
  ss58Format: 0,
  snsCoverCid: "bafybeifsztkok4p4vzjbhacvr2o4dxc5xgb7ynxsgnvmicttpqce34xdwe",
  endpoints: defaultPolkadotNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
};

export default polkadot;
