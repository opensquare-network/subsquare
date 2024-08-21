import Avatar from "../../../assets/icons/chain/calamari.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

const DEFAULT_CALAMARI_NODES = [
  {
    name: "OnFinality",
    url: "wss://calamari.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://calamari-rpc.dwellir.com",
  },
  {
    name: "Manta Network",
    url: "wss://ws.calamari.systems/",
  },
];

const calamari = {
  value: Chains.calamari,
  name: capitalize(Chains.calamari),
  identity: Chains.kusama,
  symbol: "KMA",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  noIdentityModule: true,
  ss58Format: 78,
  endpoints: DEFAULT_CALAMARI_NODES,
  avatar: Avatar,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description:
    "Calamari Network is the canary network of Manta Network, and empowers web2 and web3 applications with trustless, private on-chain identity and transaction services.",
};

export default calamari;
