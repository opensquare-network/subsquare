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
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default basilisk;
