import Chains from "../../chains";
import polkadot from "../polkadot";

const polkadotCoretime = {
  ...polkadot,
  value: Chains.polkadotCoretime,
  description:
    "A revolutionary approach to accessing the right amount of blockspace for every stage of growth.",
  endpoints: [
    {
      name: "Parity",
      url: "wss://polkadot-coretime-rpc.polkadot.io",
    },
    {
      name: "IBP2",
      url: "wss://coretime-polkadot.dotters.network",
    },
  ],
};

export default polkadotCoretime;
