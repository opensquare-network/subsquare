import Chains from "../../chains";
import kusama from "../kusama";

const kusamaCoretime = {
  ...kusama,
  value: Chains.kusamaCoretime,
  description:
    "A revolutionary approach to accessing the right amount of blockspace for every stage of growth.",
  endpoints: [
    {
      name: "Parity",
      url: "wss://kusama-coretime-rpc.polkadot.io",
    },
    {
      name: "IBP1",
      url: "wss://sys.ibp.network/coretime-kusama",
    },
    {
      name: "Stakeworld",
      url: "wss://ksm-rpc.stakeworld.io/coretime",
    },
    {
      name: "IBP2",
      url: "wss://coretime-kusama.dotters.network",
    },
    {
      name: "LuckyFriday",
      url: "wss://rpc-coretime-kusama.luckyfriday.io",
    },
    {
      name: "Dwellir",
      url: "wss://coretime-kusama-rpc.dwellir.com",
    },
  ],
};

export default kusamaCoretime;
