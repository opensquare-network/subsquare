import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconTuringDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconTuringDark"),
);
const ProjectIconTuringLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconTuringLight"),
);
const ProjectLogoTuringDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoTuringDark"),
);

export const DEFAULT_TURING_NODES = [
  {
    name: "OAK",
    url: "wss://rpc.turing.oak.tech",
  },
  {
    name: "Dwellir",
    url: "wss://turing-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://oak.tech/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/oak_network",
  },
  {
    name: "discord",
    url: "https://discord.gg/7W9UDvsbwh",
  },
  {
    name: "medium",
    url: "https://medium.com/oak-blockchain",
  },
  {
    name: "youtube",
    url: "https://youtube.com/channel/UCpR12msmm43z46PoAJ1TAiQ",
  },
  {
    name: "github",
    url: "https://github.com/OAK-Foundation/",
  },
  {
    name: "telegram",
    url: "https://t.me/OAKNetworkCommunity",
  },
];

const turing = {
  value: Chains.turing,
  name: capitalize(Chains.turing),
  identity: Chains.turing,
  symbol: "TUR",
  decimals: 10,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 51,
  endpoints: DEFAULT_TURING_NODES,
  avatar: ProjectIconTuringLight,
  darkAvatar: ProjectIconTuringDark,
  navLogo: ProjectLogoTuringDark,
  navLogoDark: ProjectLogoTuringDark,
  navPreferDark: true,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  description: "The Web 3.0 Hub for Automated DeFi and Payments",
  modules: mergeChainModules({
    treasury: {
      tips: false,
    },
  }),
  integrations: {
    subscan: true,
  },
  cssVarsLight: {
    theme100: "rgba(168,44,190,0.10)",
    theme300: "rgba(168,44,190,0.40)",
    theme500: "rgba(168,44,190,1)",
    navigationBg: "rgba(31,31,36,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.06)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(168,44,190,0.10)",
    theme300: "rgba(168,44,190,0.40)",
    theme500: "rgba(168,44,190,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default turing;
