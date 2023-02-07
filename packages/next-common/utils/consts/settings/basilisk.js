import Logo from "../../../assets/header-logos/basilisk.svg";
import Avatar from "../../../assets/icons/chain/basilisk.png";
import MenuGroups from "./menuGroups";

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
  headerBackgroundColor: "#000000",
  loginButtonPrimary: true,
  headerLogo: Logo,
  darkHeaderLogo: Logo,
  avatar: Avatar,
  endpoints: DEFAULT_BASILISK_NODES,
  group: MenuGroups.KusamaAndParachains,
};

export default basilisk;
