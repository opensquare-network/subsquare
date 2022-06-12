import Chains from "../chains";
import capitalize from "../../capitalize";

const name = Chains.centrifuge;

export const defaultNodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.parachain.centrifuge.io",
  },
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://centrifuge-rpc.dwellir.com",
  },
];

const centrifuge = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "CFG",
  decimals: 18,
  hasElections: true,
  ss58Format: 36,
  snsCoverCid: "bafybeigik7gv4e2tasibkgjhvlfyjzdlbw4p33x6o64jhdypmgqhmo3a54",
  endpoints: defaultNodes,
};

export default centrifuge;
