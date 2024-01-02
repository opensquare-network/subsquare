import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";
import {
  ProjectIconMoonbeamDark,
  ProjectIconMoonbeamLight,
  ProjectLogoMoonbeamDark,
} from "@osn/icons/subsquare";

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
  blockTime: 12000,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmQ2r48Wf6yu8d9k9VEejvcRoxNDVuiqW12ui7RCiXgWQg",
  endpoints: DEFAULT_MOONBEAM_NODES,
  avatar: ProjectIconMoonbeamLight,
  darkAvatar: ProjectIconMoonbeamDark,
  navLogo: ProjectLogoMoonbeamDark,
  navLogoDark: ProjectLogoMoonbeamDark,
  navPreferDark: true,
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
  description:
    "Solidity Smart Contracts on Polkadot. Moonbeam is a Polkadot parachain designed for developers that combines full Ethereum compatibility with the power of Polkadot.",
  cssVarsLight: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(13,17,38,1)",
    navigationActive: "rgba(255,255,255,0.06)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default moonbeam;
