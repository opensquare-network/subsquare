import Logo from "../../../assets/header-logos/moonriver.svg";
import DarkModeLogo from "../../../assets/header-logos/moonriver-dark.svg";
import Avatar from "../../../assets/icons/chain/moonriver.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";

export const DEFAULT_MOONRIVER_NODES = [
  {
    name: "Moonbeam Foundation",
    url: "wss://wss.api.moonriver.moonbeam.network",
  },
  {
    name: "OnFinality",
    url: "wss://moonriver.api.onfinality.io/public-ws",
  },
];

const moonriver = {
  value: Chains.moonriver,
  name: capitalize(Chains.moonriver),
  identity: Chains.moonriver,
  symbol: "MOVR",
  decimals: 18,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: DEFAULT_MOONRIVER_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  subscanDomain: "moonriver",
  chainType: ChainTypes.ETHEREUM,
  ethereumNetwork: {
    chainId: "0x505",
    chainName: "Moonriver",
    rpcUrls: ["https://rpc.api.moonriver.moonbeam.network"],
    blockExplorerUrls: ["https://moonriver.moonscan.io/"],
    nativeCurrency: {
      symbol: "MOVR",
      decimals: 18,
    },
  },
};

export default moonriver;
