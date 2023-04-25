import Logo from "../../../assets/header-logos/interlay.svg";
import DarkModeLogo from "../../../assets/header-logos/interlay-dark.svg";
import Avatar from "../../../assets/icons/chain/interlay.png";
import DarkAvatar from "../../../assets/icons/chain/interlay-dark.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import difference from "lodash.difference";

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
  group: MenuGroups.PolkadotAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.Council]),
  hasSubscan: true,
};

export default interlay;
