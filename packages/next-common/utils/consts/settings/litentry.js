import Logo from "../../../assets/header-logos/litentry.svg";
import DarkModeLogo from "../../../assets/header-logos/litentry-dark.svg";
import Avatar from "../../../assets/icons/chain/litentry.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoLitentryDark } from "@osn/icons/subsquare";

const DEFAULT_LITENTRY_NODES = [
  {
    name: "Litentry",
    url: "wss://rpc.litentry-parachain.litentry.io/",
  },
  {
    name: "Dwellir",
    url: "wss://litentry-rpc.dwellir.com/",
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
  hasElections: false,
  ss58Format: 31,
  snsCoverCid: "bafybeiej7his75nmaf2yhm6n3sqxf3ew2kvkyb7q37pbt37b72jwvs5cu4",
  endpoints: DEFAULT_LITENTRY_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoLitentryDark,
  navLogoDark: ProjectLogoLitentryDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  hasStatescan: true,
  hasSubscan: false,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  description: "The Litentry identity Hub allows you to aggregate your personal data from blockchains and platforms to manage granular access to dApps. Exist in a digital world without KYC. Get Maximum Privacy & Authorization Control. Share Interoperable Verifiable Credentials. Use Multi-chain Data from Web3 + Web2 Platforms",
};

export default litentry;
