import Logo from "../../../assets/header-logos/phala.svg";
import DarkModeLogo from "../../../assets/header-logos/phala-dark.svg";
import Avatar from "../../../assets/icons/chain/phala.png";
import MenuGroups from "./menuGroups";

const DEFAULT_PHALA_NODES = [
  {
    name: "Phala",
    url: "wss://api.phala.network/ws",
  },
];

const phala = {
  value: "phala",
  name: "Phala",
  icon: "khala.svg",
  identity: "phala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
  ss58Format: 30,
  snsCoverCid: "bafybeibte36v2qk5wg352hk7ewvkuhoke6iwb7l5gvjt7wy446yayxjie4",
  endpoints: DEFAULT_PHALA_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
};

export default phala;
