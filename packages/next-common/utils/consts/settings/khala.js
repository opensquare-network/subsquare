import Logo from "../../../assets/header-logos/khala.svg";
import DarkModeLogo from "../../../assets/header-logos/khala-dark.svg";
import Avatar from "../../../assets/icons/chain/khala.png";
import OptionGroups from "./menuGroups";

const DEFAULT_KHALA_NODES = [
  {
    name: "OnFinality",
    url: "wss://khala.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://khala-rpc.dwellir.com",
  },
  {
    name: "Pinknode",
    url: "wss://public-rpc.pinknode.io/khala",
  },
];

const khala = {
  value: "khala",
  name: "Khala",
  icon: "khala.svg",
  identity: "khala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
  ss58Format: 30,
  snsCoverCid: "bafybeifo4hsd3ue5ivsbcrb77fp2uvglxyc2royqvg52eo5eggnppdjxp4",
  endpoints: DEFAULT_KHALA_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroup.KusamaAndParachains,
};

export default khala;
