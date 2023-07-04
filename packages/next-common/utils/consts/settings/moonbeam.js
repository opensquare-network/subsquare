import Logo from "../../../assets/header-logos/moonbeam.svg";
import DarkModeLogo from "../../../assets/header-logos/moonbeam-dark.svg";
import Avatar from "../../../assets/icons/chain/moonbeam.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";
import { ProjectLogoMoonbeamDark } from "@osn/icons/subsquare";

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
  snsCoverCid: "QmQ2r48Wf6yu8d9k9VEejvcRoxNDVuiqW12ui7RCiXgWQg",
  endpoints: DEFAULT_MOONBEAM_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoMoonbeamDark,
  navLogoDark: ProjectLogoMoonbeamDark,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [...defaultPostLabels, "Treasury Council", "Open Tech.Comm."],
  hasSubscan: true,
  subscanDomain: "moonbeam",
  hasReferenda: true,
  // hideActionButtons: true,
  chainType: ChainTypes.ETHEREUM,
  noDispatchPrecompile: true,
  noTreasuryPrecompile: true,
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
  description: "Solidity Smart Contracts on Polkadot. Moonbeam is a Polkadot parachain designed for developers that combines full Ethereum compatibility with the power of Polkadot.",
};

export default moonbeam;
