import dynamic from "next/dynamic";
import ChainTypes from "../chainTypes";
import Chains from "../chains";
import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";

const ProjectIconHydrationDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHydrationDark"),
);
const ProjectIconHydrationLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHydrationLight"),
);
const ProjectLogoHydrationDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoHydrationDark"),
);

const endpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://hydradx-rpc.dwellir.com",
  },
  {
    name: "Helikon",
    url: "wss://rpc.helikon.io/hydradx",
  },
  {
    name: "IBP1",
    url: "wss://hydradx.paras.ibp.network",
  },
  {
    name: "IBP2",
    url: "wss://hydration.dotters.network/",
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
  domain: "hydration",
  name: "Hydration",
  identity: "hydradx",
  symbol: "HDX",
  decimals: 12,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 63,
  avatar: ProjectIconHydrationLight,
  darkAvatar: ProjectIconHydrationDark,
  navLogo: ProjectLogoHydrationDark,
  navLogoDark: ProjectLogoHydrationDark,
  navPreferDark: true,
  endpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "hydradx",
  description: "Making finance efficient, simple and unstoppable.",
  modules: mergeChainModules({
    referenda: true,
    treasury: {
      bounties: false,
      spends: true,
    },
  }),
  integrations: {
    subscan: true,
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
    mimir: true,
  },
};

export default hydradx;
