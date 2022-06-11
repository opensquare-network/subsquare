import Chains from "../chains";
import capitalize from "../../capitalize";

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
  icon: "calamari.svg",
  identity: Chains.kusama,
  symbol: "KMA",
  decimals: 12,
  hasElections: false,
  endpoints: DEFAULT_CALAMARI_NODES,
};

export default calamari;
