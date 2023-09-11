import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import ChainTypes from "../chainTypes";
import {
  ProjectIconDarwinia2Dark,
  ProjectIconDarwinia2Light,
  ProjectLogoDarwinia2Dark,
  ProjectLogoDarwinia2Light,
} from "@osn/icons/subsquare";

const DEFAULT_DARWINIA_NODES = [
  {
    name: "Darwinia",
    url: "wss://rpc.darwinia.network",
  },
  {
    name: "Darwinia Community",
    url: "wss://darwinia-rpc.darwiniacommunitydao.xyz",
  },
  {
    name: "Dwellir",
    url: "wss://darwinia-rpc.dwellir.com",
  },
  {
    name: "OnFinality",
    url: "wss://darwinia2.api.onfinality.io/public-ws",
  },
];

const defaultTestNetNodes = [
  {
    name: "Darwinia",
    url: "wss://pangoro-rpc.darwinia.network/",
  },
];

const links = [
  {
    name: "website",
    url: "https://darwinia.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/DarwiniaNetwork",
  },
  {
    name: "medium",
    url: "https://medium.com/darwinianetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/DarwiniaNetwork",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/aQdK9H4MZS",
  },
  {
    name: "github",
    url: "https://github.com/darwinia-network",
  },
  {
    name: "element",
    url: "https://app.element.io/#/room/#darwinia:matrix.org",
  },
];

const isDevelopmentEnv = process.env.NEXT_PUBLIC_DEVELOPMENT === "true";

const darwinia2 = {
  value: Chains.darwinia2,
  name: capitalize(Chains.darwinia2),
  identity: Chains.darwinia2,
  symbol: isDevelopmentEnv ? "ORING" : "RING",
  decimals: 18,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: isDevelopmentEnv ? defaultTestNetNodes : DEFAULT_DARWINIA_NODES,
  avatar: ProjectIconDarwinia2Light,
  darkAvatar: ProjectIconDarwinia2Dark,
  navLogo: ProjectLogoDarwinia2Light,
  navLogoDark: ProjectLogoDarwinia2Dark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  subscanDomain: "darwinia",
  chainType: ChainTypes.ETHEREUM,
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
  description:
    "Darwinia Provides Cross-Chain Smart Contract Platform And Message Port Network.",
  useVoteCall: true,
  cssVarsLight: {
    theme100: "rgba(219,55,138,0.10)",
    theme300: "rgba(219,55,138,0.40)",
    theme500: "rgba(219,55,138,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(219,55,138,0.10)",
    theme300: "rgba(219,55,138,0.40)",
    theme500: "rgba(219,55,138,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default darwinia2;
