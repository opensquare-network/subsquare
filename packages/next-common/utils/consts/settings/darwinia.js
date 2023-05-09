import Logo from "../../../assets/header-logos/polkadot.svg";
import DarkModeLogo from "../../../assets/header-logos/polkadot-dark.svg";
import Avatar from "../../../assets/icons/chain/polkadot.png";

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
  decimals: 9,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "bafybeidmqvyfi467agi4cum26idgh5h56wmegrjh7jnl5wvtkzbvgucmpm",
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
