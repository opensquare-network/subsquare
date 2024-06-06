import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconHydrationDark,
  ProjectIconHydrationLight,
  ProjectLogoHydrationDark,
} from "@osn/icons/subsquare";
import ChainTypes from "../chainTypes";

const endpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://hydradx-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://hydration.net/",
  },
  {
    name: "twitter",
    url: "https://x.com/hydration_net",
  },
  {
    name: "discord",
    url: "https://discord.gg/kkmY35UxAG",
  },
  {
    name: "telegram",
    url: "https://t.me/hydradx",
  },
  {
    name: "github",
    url: "https://github.com/galacticcouncil",
  },
  {
    name: "substack",
    url: "https://hydration.substack.com/",
  },
];

const ethereumNetwork = {
  chainId: "0x3640e",
  chainName: "HydraDX",
  rpcUrls: ["https://rpc.hydradx.cloud"],
  blockExplorerUrls: ["https://explorer.evm.hydration.cloud"],
  nativeCurrency: {
    symbol: "WETH",
    decimals: 18,
  },
};

const hydradx = {
  value: Chains.hydradx,
  name: "Hydration",
  identity: "hydradx",
  symbol: "HDX",
  decimals: 12,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 63,
  snsCoverCid: "bafybeict4ooyrtxtja2y5rpzumr6gz4m3dec2pzatqrl652gsbocfwzbte",
  avatar: ProjectIconHydrationLight,
  darkAvatar: ProjectIconHydrationDark,
  navLogo: ProjectLogoHydrationDark,
  navLogoDark: ProjectLogoHydrationDark,
  navPreferDark: true,
  endpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "hydradx",
  description: "Making finance efficient, simple and unstoppable.",
  modules: {
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(229,62,118,0.10)",
    theme300: "rgba(229,62,118,0.40)",
    theme500: "rgba(229,62,118,1)",
    navigationBg: "rgba(2,6,25,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(229,62,118,0.10)",
    theme300: "rgba(229,62,118,0.40)",
    theme500: "rgba(229,62,118,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "rgba(39,42,58,1)",
  },
  chainType: ChainTypes.MIXED,
  ethereumNetwork,
  multisigWallets: {
    signet: true,
  },
};

export default hydradx;
