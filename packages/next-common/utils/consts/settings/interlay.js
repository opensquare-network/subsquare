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
    name: "Kintsugi Labs",
    url: "wss://api.interlay.io/parachain",
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
  description: "Interlay is building the safest and easiest way to use Bitcoin in decentralized finance: a one-stop-shop for all things Bitcoin finance, including trading, lending, and staking.",
};

export default interlay;
