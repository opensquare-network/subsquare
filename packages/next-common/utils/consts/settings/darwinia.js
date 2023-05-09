import Logo from "../../../assets/header-logos/darwinia.svg";
import DarkModeLogo from "../../../assets/header-logos/darwinia-dark.svg";
import Avatar from "../../../assets/icons/chain/darwinia.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

export const DEFAULT_DARWINIA_NODES = [
  {
    name: "Darwinia Network",
    url: "wss://rpc.darwinia.network",
  },
  {
    name: "Dwellir",
    url: "wss://darwinia-rpc.dwellir.com",
  },
];

const darwinia = {
  value: Chains.darwinia,
  name: capitalize(Chains.darwinia),
  identity: Chains.darwinia,
  symbol: "RING",
  decimals: 18,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: DEFAULT_DARWINIA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  chainType: "ethereum",
};

export default darwinia;
