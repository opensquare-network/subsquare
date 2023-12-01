import Chains from "next-common/utils/consts/chains";
import capitalize from "next-common/utils/capitalize";
import {
  ProjectIconVaraDark,
  ProjectIconVaraLight,
  ProjectLogoVaraDark,
  ProjectLogoVaraLight,
} from "@osn/icons/subsquare";
import { defaultPostLabels } from "next-common/utils/consts/settings/common";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";

const nodes = [
  {
    name: "Vara1",
    url: "wss://subscan-archive.vara-network.io/",
  },
  {
    name: "Vara2",
    url: "wss://archive-rpc.vara-network.io/",
  },
  {
    name: "Vara3",
    url: "wss://archive.vara-network.io/",
  },
];

const links = [
  {
    name: "website",
    url: "https://vara-network.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/VaraNetwork",
  },
  {
    name: "discord",
    url: "https://discord.gg/x8ZeSy6S6K",
  },
  {
    name: "github",
    url: "https://github.com/gear-foundation",
  },
  {
    name: "medium",
    url: "https://medium.com/@VaraNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/VaraNetwork_Global",
  },
];

const name = Chains.vara;

const vara = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "VARA",
  decimals: 12,
  hasElections: false,
  ss58Format: 137,
  blockTime: 3000,
  snsCoverCid: "bafybeigeeecghmad3ap7alskf5mlifu7got2rbwcyya7qh6m6opgnd34gq",
  endpoints: nodes,
  links,
  avatar: ProjectIconVaraLight,
  darkAvatar: ProjectIconVaraDark,
  navLogo: ProjectLogoVaraLight,
  navLogoDark: ProjectLogoVaraDark,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  noDemocracyModule: true,
  hasReferenda: true,
  hasFellowship: true,
  hasDemocracy: false,
  hasTipsModule: false,
  hasStatescan: false,
  hasSubscan: true,
  hasDotreasury: false,
  hasTechComm: false,
  // used to control whether to show votes delegation percentage on referendum detail page.
  showReferendaReferendumDelegationPercentage: true,
  useVoteCall: true,
  description:
    "Vara is an ultra-fast and scalable Layer-1 decentralized network powered by the Gear Protocol.",
  cssVarsLight: {
    theme100: "rgba(11,234,179,0.10)",
    theme300: "rgba(11,234,179,0.40)",
    theme500: "rgba(11,234,179,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(11,234,179,0.10)",
    theme300: "rgba(11,234,179,0.40)",
    theme500: "rgba(11,234,179,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default vara;
