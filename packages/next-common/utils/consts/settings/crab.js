import Avatar from "../../../assets/icons/chain/crab.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

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
  identity: Chains.crab,
  symbol: "CRAB",
  decimals: 9,
  hasElections: true,
  ss58Format: 42,
  blockTime: 6000,
  endpoints: DEFAULT_CRAB_NODES,
  avatar: Avatar,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default crab;
