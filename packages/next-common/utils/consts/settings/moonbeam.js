import Logo from "../../../assets/header-logos/darwinia2.svg";
import DarkModeLogo from "../../../assets/header-logos/darwinia2-dark.svg";
import Avatar from "../../../assets/icons/chain/darwinia2.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";

export const DEFAULT_MOONBEAM_NODES = [
  {
    name: "Moonbeam Foundation",
    url: "wss://wss.api.moonbeam.network",
  },
  {
    name: "OnFinality",
    url: "wss://moonbeam.api.onfinality.io/public-ws",
  },
];

const moonbeam = {
  value: Chains.moonbeam,
  name: capitalize(Chains.moonbeam),
  identity: Chains.moonbeam,
  symbol: "MOVR",
  decimals: 18,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: DEFAULT_MOONBEAM_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  subscanDomain: "moonbeam",
  chainType: ChainTypes.ETHEREUM,
  ethereumNetwork: {
    chainId: "0x504",
    chainName: "Moonbeam",
    rpcUrls: ["https://rpc.api.moonbeam.network"],
    blockExplorerUrls: ["https://moonscan.io/"],
    nativeCurrency: {
      symbol: "GLMR",
      decimals: 18,
    },
  },
};

export default moonbeam;
