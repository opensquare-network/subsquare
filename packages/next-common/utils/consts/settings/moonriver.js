import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";
import dynamic from "next/dynamic";

const ProjectIconMoonriverDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconMoonriverDark"),
);
const ProjectIconMoonriverLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconMoonriverLight"),
);
const ProjectLogoMoonriverDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoMoonriverDark"),
);

export const DEFAULT_MOONRIVER_NODES = [
  {
    name: "Moonbeam Foundation",
    url: "wss://wss.api.moonriver.moonbeam.network",
  },
  {
    name: "OnFinality",
    url: "wss://moonriver.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://moonriver-rpc.dwellir.com",
  },
];

const moonriver = {
  value: Chains.moonriver,
  name: capitalize(Chains.moonriver),
  identity: Chains.moonriver,
  symbol: "MOVR",
  decimals: 18,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 18,
  endpoints: DEFAULT_MOONRIVER_NODES,
  navLogo: ProjectLogoMoonriverDark,
  navLogoDark: ProjectLogoMoonriverDark,
  navPreferDark: true,
  avatar: ProjectIconMoonriverLight,
  darkAvatar: ProjectIconMoonriverDark,
  group: MenuGroups.KusamaAndParachains,
  postLabels: [...defaultPostLabels, "Treasury Council", "Open Tech.Comm."],
  hasSubscan: true,
  subscanDomain: "moonriver",
  hasTipsModule: false,
  hasPolkassemblyDiscussions: true,
  // hideActionButtons: true,
  chainType: ChainTypes.ETHEREUM,
  noDispatchPrecompile: true,
  noTreasuryPrecompile: true,
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
  description:
    "Solidity Smart Contracts on Kusama. Moonriver is a community-led cousin parachain on Kusama and will provide a permanently incentivized canary network for Moonbeam.",
  useVoteCall: true,
  modules: {
    referenda: true,
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(79,204,198,0.10)",
    theme300: "rgba(79,204,198,0.40)",
    theme500: "rgba(79,204,198,1)",
    navigationBg: "rgba(13,17,38,1)",
    navigationActive: "rgba(255,255,255,0.06)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(79,204,198,0.10)",
    theme300: "rgba(79,204,198,0.40)",
    theme500: "rgba(79,204,198,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default moonriver;
