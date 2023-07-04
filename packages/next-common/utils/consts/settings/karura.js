import Logo from "../../../assets/header-logos/karura.svg";
import DarkModeLogo from "../../../assets/header-logos/karura-dark.svg";
import Avatar from "../../../assets/icons/chain/karura.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { ProjectLogoKaruraDark } from "@osn/icons/subsquare";

export const DEFAULT_KARURA_NODES = [
  {
    name: "Acala Foundation 0",
    url: "wss://karura-rpc-0.aca-api.network",
  },
  {
    name: "Acala Foundation 1",
    url: "wss://karura-rpc-1.aca-api.network",
  },
  {
    name: "Acala Foundation 2",
    url: "wss://karura-rpc-2.aca-api.network/ws",
  },
  {
    name: "Acala Foundation 3",
    url: "wss://karura-rpc-3.aca-api.network/ws",
  },
  {
    name: "Polkawallet",
    url: "wss://karura.polkawallet.io",
  },
  {
    name: "OnFinality",
    url: "wss://karura.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://karura-rpc.dwellir.com",
  },
];

const links = [
  {
    name: "website",
    url: "https://acala.network/karura",
  },
  {
    name: "twitter",
    url: "https://twitter.com/KaruraNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/acalaofficial",
  },
  {
    name: "discord",
    url: "https://www.acala.gg/",
  },
  {
    name: "github",
    url: "https://github.com/AcalaNetwork",
  },
];

const karura = {
  value: "karura",
  name: "Karura",
  identity: "kusama",
  symbol: "KAR",
  decimals: 12,
  hasElections: false,
  ss58Format: 8,
  snsCoverCid: "bafybeiaoq7r32qsnpjqcey3x5hxfikbq3artjzi32he7dkretvesqgf3ny",
  endpoints: DEFAULT_KARURA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoKaruraDark,
  navLogoDark: ProjectLogoKaruraDark,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: [...defaultPostLabels, PostLabel.Financial],
  hasSubscan: true,
  useVoteCall: true,
  description: "Cross-chain DeFi Hub for Polkadot, Kusama and beyond.",
};

export default karura;
