import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconLitmusDark,
  ProjectIconLitmusLight,
  ProjectLogoLitmusLight,
} from "@osn/icons/subsquare";

const DEFAULT_LITMUS_NODES = [
  {
    name: "Litentry",
    url: "wss://rpc.litmus-parachain.litentry.io",
  },
];

const links = [
  {
    name: "website",
    url: "https://kusama-crowdloan.litentry.com/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/litentry",
  },
  {
    name: "telegram",
    url: "https://t.me/litentry",
  },
  {
    name: "github",
    url: "https://github.com/litentry",
  },
  {
    name: "medium",
    url: "https://litentry.medium.com/",
  },
];

const litmus = {
  value: Chains.litmus,
  name: capitalize(Chains.litmus),
  identity: Chains.kusama,
  symbol: "LIT",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 131,
  snsCoverCid: "bafybeiexfrkdte6eruqghlc66xpnfoyadkgq5we3ql5elqjwgdzbxmez6q",
  endpoints: DEFAULT_LITMUS_NODES,
  avatar: ProjectIconLitmusLight,
  darkAvatar: ProjectIconLitmusDark,
  navLogo: ProjectLogoLitmusLight,
  navLogoDark: ProjectLogoLitmusLight,
  links,
  group: MenuGroups.KusamaAndParachains,
  hasStatescan: true,
  hasSubscan: false,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasTipsModule: false,
  description:
    "Litmus is a companion canary network to Litentry and connects to the Kusama ecosystem as parachain.",
  cssVarsLight: {
    theme100: "rgba(104,34,251,0.10)",
    theme300: "rgba(104,34,251,0.40)",
    theme500: "rgba(104,34,251,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(104,34,251,0.10)",
    theme300: "rgba(104,34,251,0.40)",
    theme500: "rgba(104,34,251,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default litmus;
