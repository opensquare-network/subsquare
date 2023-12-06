import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconLitentryDark,
  ProjectIconLitentryLight,
  ProjectLogoLitentryDark,
} from "@osn/icons/subsquare";

const DEFAULT_LITENTRY_NODES = [
  {
    name: "Dwellir",
    url: "wss://litentry-rpc.dwellir.com/",
  },
  {
    name: "Litentry",
    url: "wss://rpc.litentry-parachain.litentry.io",
  },
  {
    name: "OnFinality",
    url: "wss://litentry.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://litentry.com",
  },
  {
    name: "twitter",
    url: "https://twitter.com/litentry",
  },
  {
    name: "medium",
    url: "https://medium.com/litentry",
  },
  {
    name: "telegram",
    url: "https://t.me/litentry",
  },
  {
    name: "discord",
    url: "https://discord.gg/6KxSqDPgWh",
  },
  {
    name: "github",
    url: "https://github.com/litentry",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/channel/UCbv8QnsNngpV6RMd0Bo2ZBw",
  },
];

const litentry = {
  value: Chains.litentry,
  name: capitalize(Chains.litentry),
  identity: Chains.polkadot,
  symbol: "LIT",
  decimals: 12,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 31,
  snsCoverCid: "bafybeiej7his75nmaf2yhm6n3sqxf3ew2kvkyb7q37pbt37b72jwvs5cu4",
  endpoints: DEFAULT_LITENTRY_NODES,
  avatar: ProjectIconLitentryLight,
  darkAvatar: ProjectIconLitentryDark,
  navLogo: ProjectLogoLitentryDark,
  navLogoDark: ProjectLogoLitentryDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  hasStatescan: true,
  hasSubscan: false,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasTipsModule: false,
  noIdentityModule: true,
  hasMultisig: true,
  multisigApiPrefix: "litentry",
  description:
    "The Litentry identity Hub allows you to aggregate your personal data from blockchains and platforms to manage granular access to dApps. Exist in a digital world without KYC. Get Maximum Privacy & Authorization Control. Share Interoperable Verifiable Credentials. Use Multi-chain Data from Web3 + Web2 Platforms",
  cssVarsLight: {
    theme100: "rgba(21,184,135,0.10)",
    theme300: "rgba(21,184,135,0.40)",
    theme500: "rgba(21,184,135,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(21,184,135,0.10)",
    theme300: "rgba(21,184,135,0.40)",
    theme500: "rgba(21,184,135,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default litentry;
