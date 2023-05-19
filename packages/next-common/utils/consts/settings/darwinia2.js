import Logo from "../../../assets/header-logos/darwinia2.svg";
import DarkModeLogo from "../../../assets/header-logos/darwinia2-dark.svg";
import Avatar from "../../../assets/icons/chain/darwinia2.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

export const DEFAULT_DARWINIA_NODES = [
  {
    name: "Darwinia Network",
    url: "wss://rpc.darwinia.network",
  },
  {
    name: "Dwellir",
    url: "wss://darwinia-rpc.dwellir.com",
  },
];

const darwinia2 = {
  value: Chains.darwinia2,
  name: capitalize(Chains.darwinia2),
  identity: Chains.darwinia2,
  symbol: "RING",
  decimals: 18,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: DEFAULT_DARWINIA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  subscanDomain: "darwinia",
  chainType: "ethereum",
  ethereumNetwork: {
    chainId: "0x2e",
    chainName: "Darwinia2",
    rpcUrls: ["https://rpc.darwinia.network"],
    blockExplorerUrls: ["https://darwinia.subscan.io/"],
    nativeCurrency: {
      symbol: "RING",
      decimals: 18,
    },
  },
};

export default darwinia2;
