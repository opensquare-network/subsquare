import capitalize from "../../capitalize";
import Chains from "../chains";

const name = Chains.westend;

const westend = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "DOT",
  decimals: 12,
  ss58Format: 42,
  hasSubscan: true,
  description: "Westend is the primary test network of Polkadot.",
};

export default westend;
