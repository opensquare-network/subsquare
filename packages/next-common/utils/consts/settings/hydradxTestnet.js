import ChainTypes from "../chainTypes";
import Chains from "../chains";
import hydradx from "./hydradx";
import MenuGroups from "./menuGroups";

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
  ...hydradx,
  value: Chains.hydradxTestnet,
  name: "HydraDX Testnet",
  group: MenuGroups.Testnet,
  endpoints,
  chainType: ChainTypes.MIXED,
  ethereumNetwork,
};

export default hydradxTestnet;
