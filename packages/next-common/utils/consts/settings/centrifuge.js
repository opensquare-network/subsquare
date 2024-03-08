import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { difference } from "lodash-es";
import {
  ProjectIconCentrifugeDark,
  ProjectIconCentrifugeLight,
  ProjectLogoCentrifugeDark,
  ProjectLogoCentrifugeLight,
} from "@osn/icons/subsquare";

const name = Chains.centrifuge;

export const defaultNodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.centrifuge.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-centrifuge.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
];

// centrifuge network social links
const links = [
  {
    name: "website",
    url: "https://centrifuge.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/centrifuge",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/yEzyUq5gxF",
  },
  {
    name: "github",
    url: "https://github.com/centrifuge/",
  },
];

const centrifuge = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "CFG",
  decimals: 18,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 36,
  snsCoverCid: "bafybeigik7gv4e2tasibkgjhvlfyjzdlbw4p33x6o64jhdypmgqhmo3a54",
  endpoints: defaultNodes,
  avatar: ProjectIconCentrifugeLight,
  darkAvatar: ProjectIconCentrifugeDark,
  navLogo: ProjectLogoCentrifugeLight,
  navLogoDark: ProjectLogoCentrifugeDark,
  links,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://gov.centrifuge.io",
  group: MenuGroups.PolkadotAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.TechComm]),
  hasSubscan: true,
  hasDiscussions: false,
  hasTechComm: false,
  hasTipsModule: false,
  description: "Real-world DeFi: The on-chain ecosystem for structured credit.",
  useVoteCall: true,
  hasDotreasury: true,
  hasMultisig: true,
  multisigApiPrefix: "cfg",
  cssVarsLight: {
    theme100: "rgba(18,83,255,0.10)",
    theme300: "rgba(18,83,255,0.40)",
    theme500: "rgba(18,83,255,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(18,83,255,0.10)",
    theme300: "rgba(18,83,255,0.40)",
    theme500: "rgba(18,83,255,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default centrifuge;
