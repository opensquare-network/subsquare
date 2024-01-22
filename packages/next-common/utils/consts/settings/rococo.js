import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import Chains from "../chains";
import { defaultPostLabels } from "./common";
import {
  ProjectIconRococoDark,
  ProjectIconRococoLight,
  ProjectLogoRococoDark,
  ProjectLogoRococoLight,
} from "@osn/icons/subsquare";

export const defaultRococoNodes = [
  {
    name: "Parity",
    url: "wss://rococo-rpc.polkadot.io",
  },
];

const name = Chains.rococo;

const links = [
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot",
  },
];

const rococo = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "ROC",
  decimals: 12,
  hasElections: true,
  ss58Format: 42,
  blockTime: 6000,
  snsCoverCid: "bafybeia7np32r7cq2ykeeopfyxfgxhhsi2e4tl4bew4zjwu2zixiw2rx74",
  endpoints: defaultRococoNodes,
  avatar: ProjectIconRococoLight,
  darkAvatar: ProjectIconRococoDark,
  navLogo: ProjectLogoRococoLight,
  navLogoDark: ProjectLogoRococoDark,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasReferenda: true,
  hasFellowship: true,
  hasTipsModule: false,
  noDemocracyModule: true,
  hasSubscan: true,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://forum.polkadot.network",
  description: "Polkadot’s Parachain Testnet",
  cssVarsLight: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default rococo;
