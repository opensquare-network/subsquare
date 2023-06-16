import Logo from "../../../assets/header-logos/phala.svg";
import DarkModeLogo from "../../../assets/header-logos/phala-dark.svg";
import Avatar from "../../../assets/icons/chain/phala.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoPhalaDark } from "@osn/icons/subsquare";

const DEFAULT_PHALA_NODES = [
  {
    name: "Phala",
    url: "wss://api.phala.network/ws",
  },
  {
    name: "OnFinality",
    url: "wss://phala.api.onfinality.io/public-ws",
  },
];

const phala = {
  value: "phala",
  name: "Phala",
  identity: "phala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
  ss58Format: 30,
  snsCoverCid: "bafybeibte36v2qk5wg352hk7ewvkuhoke6iwb7l5gvjt7wy446yayxjie4",
  endpoints: DEFAULT_PHALA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoPhalaDark,
  navLogoDark: ProjectLogoPhalaDark,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default phala;
