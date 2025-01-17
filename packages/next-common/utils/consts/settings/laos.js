import dynamic from "next/dynamic";
import ChainTypes from "../chainTypes";
import Chains from "../chains";
import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";

const ProjectIconLaosDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconLaosDark"),
);
const ProjectIconLaosLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconLaosLight"),
);
const ProjectLogoLaosDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoLaosDark"),
);
const ProjectLogoLaosLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoLaosLight"),
);

const endpoints = [
  {
    name: "Laos Foundation",
    url: "wss://rpc.laos.laosfoundation.io",
  },
];

const links = [
  {
    name: "website",
    url: "https://laosnetwork.io/",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/gZcxsJcdPy",
  },
  {
    name: "twitter",
    url: "https://twitter.com/laosnetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/+qI2I19EI-VAzNGVk",
  },
  {
    name: "linkedin",
    url: "https://www.linkedin.com/company/laosnetwork/",
  },
  {
    name: "github",
    url: "https://github.com/freeverseio/laos",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/@laosnetwork",
  },
];

const ethereumNetwork = {
  chainId: "0x188b",
  chainName: "Laos",
  rpcUrls: ["https://rpc.laos.laosfoundation.io"],
  blockExplorerUrls: ["https://blockscout.laos.laosfoundation.io/"],
  nativeCurrency: {
    symbol: "LAOS",
    decimals: 18,
  },
};

const laos = {
  value: Chains.laos,
  domain: "laos",
  name: "LAOS",
  identity: "laos",
  symbol: "LAOS",
  decimals: 18,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 42,
  avatar: ProjectIconLaosLight,
  darkAvatar: ProjectIconLaosDark,
  navLogo: ProjectLogoLaosLight,
  navLogoDark: ProjectLogoLaosDark,
  navPreferDark: true,
  endpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  // hasMultisig: true,
  // multisigApiPrefix: "laos",
  description:
    "The universal Layer-1 for digital assets across all blockchains.",
  modules: mergeChainModules({
    treasury: {
      bounties: false,
      tips: false,
    },
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(218,132,90,0.10)",
    theme300: "rgba(218,132,90,0.40)",
    theme500: "rgba(218,132,90,1)",
    navigationBg: "rgba(96,49,158,1)",
    navigationBgFrom: "rgba(96,49,158,1)",
    navigationBgTo: "rgba(218,132,90,1)",
    navigationActive: "rgba(255,255,255,0.08)",
    navigationBorder: "rgba(255,255,255,0.1)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(218,132,90,0.10)",
    theme300: "rgba(218,132,90,0.40)",
    theme500: "rgba(218,132,90,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  chainType: ChainTypes.ETHEREUM,
  substrateThroughEthereumAddress: true,
  disableEvmWallet: true,
  ethereumNetwork,
};

export default laos;
