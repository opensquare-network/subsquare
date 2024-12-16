import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconCrustDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconCrustDark"),
);
const ProjectIconCrustLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconCrustLight"),
);
const ProjectLogoCrustDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoCrustDark"),
);

const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws",
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network",
  },
  {
    name: "Dwellir",
    url: "wss://crust-mainnet-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://crust.network",
  },
  {
    name: "twitter",
    url: "https://twitter.com/CrustNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/crustnetwork",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/Jbw2PAUSCR",
  },
  {
    name: "medium",
    url: "https://crustnetwork.medium.com/",
  },
  {
    name: "github",
    url: "https://github.com/crustio",
  },
];

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
  ss58Format: 66,
  blockTime: 6000,
  endpoints: DEFAULT_CRUST_NODES,
  avatar: ProjectIconCrustLight,
  darkAvatar: ProjectIconCrustDark,
  navLogo: ProjectLogoCrustDark,
  navLogoDark: ProjectLogoCrustDark,
  navPreferDark: true,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  showAccountManagementTab: false,
  description:
    "CRUST implements the incentive layer protocol for decentralized storage. It is adaptable to multiple storage layer protocols such as IPFS, and provides support for the application layer. ",
  modules: mergeChainModules({
    preimages: false,
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(250,140,22,0.10)",
    theme300: "rgba(250,140,22,0.40)",
    theme500: "rgba(250,140,22,1)",
    navigationBg: "rgba(38,38,39,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.06)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(250,140,22,0.10)",
    theme300: "rgba(250,140,22,0.40)",
    theme500: "rgba(250,140,22,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  multisigWallets: {
    mimir: true,
  },
};

export default crust;
