import Logo from "../../../assets/header-logos/interlay.svg";
import DarkModeLogo from "../../../assets/header-logos/interlay-dark.svg";
import Avatar from "../../../assets/icons/chain/interlay.png";
import DarkAvatar from "../../../assets/icons/chain/interlay-dark.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import difference from "lodash.difference";
import {
  ProjectLogoInterlayDark,
  ProjectLogoInterlayLight,
} from "@osn/icons/subsquare";

const DEFAULT_INTERLAY_NODES = [
  {
    name: "Dwellir",
    url: "wss://interlay-rpc.dwellir.com/",
  },
  {
    name: "Kintsugi Labs",
    url: "wss://api.interlay.io/parachain",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-interlay.luckyfriday.io/",
  },
  {
    name: "OnFinality",
    url: "wss://interlay.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://interlay.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/interlayHQ",
  },
  {
    name: "medium",
    url: "https://medium.com/interlay",
  },
  {
    name: "telegram",
    url: "https://t.me/interlay_community",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/interlay",
  },
  {
    name: "github",
    url: "https://github.com/interlay",
  },
];

const interlay = {
  value: "interlay",
  name: "Interlay",
  identity: "interlay",
  symbol: "INTR",
  voteSymbol: "vINTR",
  decimals: 10,
  hasElections: false,
  ss58Format: 2032,
  snsCoverCid: "bafybeifqabzy3677ms2jihcb4ed4kxcvbjtxskctjboidcoy7pbosqrqyi",
  endpoints: DEFAULT_INTERLAY_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoInterlayLight,
  navLogoDark: ProjectLogoInterlayDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.Council]),
  hasSubscan: true,
  description:
    "Interlay is building the safest and easiest way to use Bitcoin in decentralized finance: a one-stop-shop for all things Bitcoin finance, including trading, lending, and staking.",
  useVoteCall: true,
  cssVarsLight: {
    theme100: "rgba(7,90,188,0.10)",
    theme300: "rgba(7,90,188,0.40)",
    theme500: "rgba(7,90,188,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(7,90,188,0.10)",
    theme300: "rgba(7,90,188,0.40)",
    theme500: "rgba(7,90,188,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default interlay;
