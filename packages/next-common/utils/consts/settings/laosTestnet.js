import Chains from "../chains";
import laos from "./laos";
import MenuGroups from "./menuGroups";

const endpoints = [
  {
    name: "Laos Foundation",
    url: "wss://rpc.laossigma.laosfoundation.io",
  },
];

const ethereumNetwork = {
  chainId: "0xf582",
  chainName: "Laos Testnet",
  rpcUrls: ["https://rpc.laossigma.laosfoundation.io"],
  blockExplorerUrls: ["https://sigma.explorer.laosnetwork.io/"],
  nativeCurrency: {
    symbol: "LAOS",
    decimals: 18,
  },
};

const laosTestnet = {
  ...laos,
  value: Chains.laosTestnet,
  domain: "laos-testnet",
  name: "Laos Testnet",
  group: MenuGroups.Testnet,
  endpoints,
  ethereumNetwork,
};

export default laosTestnet;
