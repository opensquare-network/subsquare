import Logo from "../../../assets/header-logos/khala.svg";
import DarkModeLogo from "../../../assets/header-logos/khala-dark.svg";
import Avatar from "../../../assets/icons/chain/khala.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoKhalaDark } from "@osn/icons/subsquare";
import phala from "./phala";

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
    name: "Phala",
    url: "wss://khala-api.phala.network/ws",
  },
];

const links = phala.links;

const khala = {
  value: "khala",
  name: "Khala",
  identity: "khala",
  symbol: "PHA",
  decimals: 12,
  hasElections: true,
  ss58Format: 30,
  snsCoverCid: "bafybeifo4hsd3ue5ivsbcrb77fp2uvglxyc2royqvg52eo5eggnppdjxp4",
  endpoints: DEFAULT_KHALA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoKhalaDark,
  navLogoDark: ProjectLogoKhalaDark,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description:
    "Khala Network is the canary network of Phala launched on Kusama and is responsible for the technical and economic testing of Phala Network.",
  useVoteCall: true,
};

export default khala;
