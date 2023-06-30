import Logo from "../../../assets/header-logos/basilisk.svg";
import DarkModeLogo from "../../../assets/header-logos/basilisk-dark.svg";
import Avatar from "../../../assets/icons/chain/basilisk.png";
import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import { ProjectLogoBasiliskDark } from "@osn/icons/subsquare";

const DEFAULT_BASILISK_NODES = [
  {
    name: "Basilisk",
    url: "wss://rpc.basilisk.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://basilisk-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://bsx.fi",
  },
  {
    name: "twitter",
    url: "https://twitter.com/bsx_finance",
  },
  {
    name: "telegram",
    url: "https://t.me/bsx_fi",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/S8YZj5aXR6",
  },
  {
    name: "github",
    url: "https://github.com/galacticcouncil",
  },
  {
    name: "reddit",
    url: "https://www.reddit.com/r/bsx_fi/",
  },
];

const basilisk = {
  value: "basilisk",
  name: "Basilisk",
  identity: "basilisk",
  symbol: "BSX",
  decimals: 12,
  hasElections: true,
  ss58Format: 10041,
  snsCoverCid: "bafybeicxl7g3sjtq2bflm4itrxwlibbt3jhwybf24fex4hf3hyuwbbeawy",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoBasiliskDark,
  navLogoDark: ProjectLogoBasiliskDark,
  endpoints: DEFAULT_BASILISK_NODES,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  useVoteCall: true,
  description: "Snek brings permissionless liquidity to the Kusama ecosystem. Swap tokens, flip NFTs and earn rewards. Help young crypto projects bootstrap liquidity and receive tokens.",
};

export default basilisk;
