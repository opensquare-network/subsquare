import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import dynamic from "next/dynamic";
import { mergeChainModules } from "./common/modules";

const ProjectIconZeigeistDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconZeigeistDark"),
);
const ProjectIconZeigeistLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconZeigeistLight"),
);
const ProjectLogoZeigeistDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoZeigeistDark"),
);

const defaultNodes = [
  {
    name: "OnFinality",
    url: "wss://zeitgeist.api.onfinality.io/public-ws",
  },
  {
    name: "ZeitgeistPM",
    url: "wss://main.rpc.zeitgeist.pm/ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://zeitgeist.pm",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/xv8HuA4s8v",
  },
  {
    name: "github",
    url: "https://github.com/ZeitgeistPM",
  },
  {
    name: "twitter",
    url: "https://twitter.com/ZeitgeistPM",
  },
];

const zeitgeist = {
  value: Chains.zeitgeist,
  name: capitalize(Chains.zeitgeist),
  identity: Chains.zeitgeist,
  symbol: "ZTG",
  decimals: 10,
  hasElections: false,
  ss58Format: 73,
  blockTime: 12000,
  endpoints: defaultNodes,
  avatar: ProjectIconZeigeistLight,
  darkAvatar: ProjectIconZeigeistDark,
  navLogo: ProjectLogoZeigeistDark,
  navLogoDark: ProjectLogoZeigeistDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [...defaultPostLabels, PostLabel.Advisory, "ZIP", "Court"],
  hasSubscan: true,
  useVoteCall: true,
  description:
    "A Prediction Markets protocol built on Polkadot. With the world’s leading forecasting minds, we’re building the best prediction markets app available.",
  modules: mergeChainModules({
    treasury: {
      bounties: false,
      tips: false,
    },
  }),
  cssVarsLight: {
    theme100: "rgba(28,100,242,0.10)",
    theme300: "rgba(28,100,242,0.40)",
    theme500: "rgba(28,100,242,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(28,100,242,0.10)",
    theme300: "rgba(28,100,242,0.40)",
    theme500: "rgba(28,100,242,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default zeitgeist;
