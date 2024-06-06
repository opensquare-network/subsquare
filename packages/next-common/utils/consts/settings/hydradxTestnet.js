import ChainTypes from "../chainTypes";
import Chains from "../chains";
import hydration from "./hydration";

const endpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.nice.hydration.cloud/",
  },
];

const ethereumNetwork = {
  chainId: "0x3640e",
  chainName: "HydraDX Testnet",
  rpcUrls: ["https://rpc.nice.hydration.cloud"],
  blockExplorerUrls: ["https://explorer.nice.hydration.cloud"],
  nativeCurrency: {
    symbol: "WETH",
    decimals: 18,
  },
};

const hydradxTestnet = {
  ...hydration,
  value: Chains.hydradxTestnet,
  name: "HydraDX Testnet",
  endpoints,
  chainType: ChainTypes.MIXED,
  hasStatescan: true,
  hasSubscan: false,
  ethereumNetwork,
  modules: {
    democracy: true,
  },
};

export default hydradxTestnet;
