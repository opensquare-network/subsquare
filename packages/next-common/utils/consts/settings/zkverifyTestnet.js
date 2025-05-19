import Chains from "../chains";
import { mergeChainModules } from "./common/modules";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";

const ProjectIconZkverifyDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconZkverifyDark"),
);
const ProjectIconZkverifyLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconZkverifyLight"),
);
const ProjectLogoZkverifyDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoZkverifyDark"),
);
const ProjectLogoZkverifyLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoZkverifyLight"),
);

const DEFAULT_ZKVERIFY_NODES = [
  {
    name: "ZKVerify",
    url: "wss://zkverify-volta.nirvanalabs.xyz/VoltaSubSquare-mhq7r?apikey=0d7c82be-b75c-4eca-a086-5d70c64705f7",
  },
];

const links = [
  {
    name: "website",
    url: "https://zkverify.io/",
  },
  {
    name: "twitter",
    url: "https://x.com/ZKVProtocol",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/zkverify",
  },
  {
    name: "telegram",
    url: "https://t.me/zkverify",
  },
  {
    name: "github",
    url: "https://github.com/HorizenLabs/zkVerify",
  },
];

const zkverifyTestnet = {
  value: Chains.zkverifyTestnet,
  name: "ZKVerify Testnet",
  identity: Chains.zkverifyTestnet,
  symbol: "tVFY",
  decimals: 18,
  hasElections: false,
  ss58Format: 251,
  blockTime: 6000,
  endpoints: DEFAULT_ZKVERIFY_NODES,
  avatar: ProjectIconZkverifyLight,
  darkAvatar: ProjectIconZkverifyDark,
  navLogo: ProjectLogoZkverifyLight,
  navLogoDark: ProjectLogoZkverifyDark,
  navPreferDark: true,
  links,
  group: MenuGroups.Testnet,
  postLabels: [],
  showAccountManagementTab: false,
  description: "The modular blockchain for ZK proof verification.",
  modules: mergeChainModules({
    democracy: false,
    referenda: true,
    treasury: false,
    council: false,
    technicalCommittee: false,
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(38,219,141,0.10)",
    theme300: "rgba(38,219,141,0.40)",
    theme500: "rgba(38,219,141,1)",
    navigationBg: "rgba(5,5,6,1)",
    navigationActive: "rgba(255,255,255,0.08)",
    navigationBorder: "rgba(255,255,255,0.10)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(38,219,141,0.10)",
    theme300: "rgba(38,219,141,0.40)",
    theme500: "rgba(38,219,141,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  allowWeb2Login: true,
};

export default zkverifyTestnet;
