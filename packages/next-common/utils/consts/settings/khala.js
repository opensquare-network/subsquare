import dynamic from "next/dynamic";
import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import phala from "./phala";

const ProjectIconKhalaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKhalaDark"),
);
const ProjectIconKhalaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKhalaLight"),
);
const ProjectLogoKhalaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoKhalaDark"),
);

const DEFAULT_KHALA_NODES = [
  {
    name: "Dwellir",
    url: "wss://khala-rpc.dwellir.com",
  },
  {
    name: "Helikon",
    url: "wss://rpc.helikon.io/khala",
  },
  {
    name: "OnFinality",
    url: "wss://khala.api.onfinality.io/public-ws",
  },
  {
    name: "Phala",
    url: "wss://khala-api.phala.network/ws",
  },
  {
    name: "RadiumBlock",
    url: "wss://khala.public.curie.radiumblock.co/ws",
  },
  {
    name: "Rockx",
    url: "wss://rockx-khala.w3node.com/polka-public-khala/ws",
  },
];

const links = phala.links;

const khala = {
  value: "khala",
  name: "Khala",
  identity: "khala",
  symbol: "PHA",
  decimals: 12,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 30,
  endpoints: DEFAULT_KHALA_NODES,
  avatar: ProjectIconKhalaLight,
  darkAvatar: ProjectIconKhalaDark,
  navLogo: ProjectLogoKhalaDark,
  navLogoDark: ProjectLogoKhalaDark,
  navPreferDark: true,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description:
    "Khala Network is the canary network of Phala launched on Kusama and is responsible for the technical and economic testing of Phala Network.",
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "khala",
  modules: {
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(5,227,227,0.10)",
    theme300: "rgba(5,227,227,0.40)",
    theme500: "rgba(5,227,227,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(5,227,227,0.10)",
    theme300: "rgba(5,227,227,0.40)",
    theme500: "rgba(5,227,227,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "rgba(39,42,58,1)",
  },
  multisigWallets: {
    signet: true,
  },
};

export default khala;
