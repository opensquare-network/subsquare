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
  snsCoverCid: "QmR2LSfa9e46C1Wc5LTZ2oRm9wkdaxfX4SyhYXVohcsdrB",
  endpoints: DEFAULT_MOONRIVER_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.KusamaAndParachains,
  postLabels: [...defaultPostLabels, "Treasury Council", "Open Tech.Comm."],
  hasSubscan: true,
  subscanDomain: "moonriver",
  hasReferenda: true,
  // hideActionButtons: true,
  chainType: ChainTypes.ETHEREUM,
  noDispatchPrecompile: true,
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
