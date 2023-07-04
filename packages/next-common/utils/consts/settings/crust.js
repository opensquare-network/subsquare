import Logo from "../../../assets/header-logos/crust.svg";
import DarkModeLogo from "../../../assets/header-logos/crust-dark.svg";
import Avatar from "../../../assets/icons/chain/crust.png";
import DarkAvatar from "../../../assets/icons/chain/crust-dark.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoCrustDark } from "@osn/icons/subsquare";

const DEFAULT_CRUST_NODES = [
  {
    name: "OnFinality",
    url: "wss://crust.api.onfinality.io/public-ws",
  },
  {
    name: "Crust",
    url: "wss://rpc.crust.network",
  },
  {
    name: "Decoo Technologies",
    url: "wss://rpc-crust-mainnet.decoo.io",
  },
  {
    name: "DCloud Foundation",
    url: "wss://api.decloudf.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://crust.network",
  },
  {
    name: "twitter",
    url: "https://twitter.com/CrustNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/crustnetwork",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/Jbw2PAUSCR",
  },
  {
    name: "medium",
    url: "https://crustnetwork.medium.com/",
  },
  {
    name: "github",
    url: "https://github.com/crustio",
  },
];

const crust = {
  value: Chains.crust,
  name: capitalize(Chains.crust),
  identity: "crust",
  symbol: "CRU",
  decimals: 12,
  hasElections: false,
  ss58Format: 66,
  blockTime: 6000,
  snsCoverCid: "bafybeicb77dwocjcssmcb75irbsvxly4ep335pky2r7tvwsjnoyzpl3c3y",
  endpoints: DEFAULT_CRUST_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoCrustDark,
  navLogoDark: ProjectLogoCrustDark,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  description: "CRUST implements the incentive layer protocol for decentralized storage. It is adaptable to multiple storage layer protocols such as IPFS, and provides support for the application layer. ",
};

export default crust;
