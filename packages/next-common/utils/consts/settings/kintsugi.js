import Logo from "../../../assets/header-logos/kintsugi.svg";
import DarkModeLogo from "../../../assets/header-logos/kintsugi-dark.svg";
import Avatar from "../../../assets/icons/chain/kintsugi.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import difference from "lodash.difference";
import { ProjectLogoKintsugiDark } from "@osn/icons/subsquare";

const DEFAULT_KINTSUGI_NODES =
  process.env.NEXT_PUBLIC_DEVELOPMENT === "true"
    ? [
        {
          name: "Kintsugi Test Endpoint",
          url: "wss://api-dev-kintsugi.interlay.io/parachain",
        },
      ]
    : [
        {
          name: "OnFinality",
          url: "wss://kintsugi.api.onfinality.io/public-ws",
        },
        {
          name: "Kintsugi Labs",
          url: "wss://api-kusama.interlay.io/parachain",
        },
      ];

const links = [
  {
    name: "website",
    url: "https://parachains.info/details/kintsugi/",
  },
  {
    name: "telegram",
    url: "https://t.me/interlay_community",
  },
  {
    name: "twitter",
    url: "https://twitter.com/kintsugi_btc",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/interlay",
  },
  {
    name: "medium",
    url: "https://interlay.medium.com/",
  },
  {
    name: "github",
    url: "https://github.com/interlay/interbtc",
  },
];

const kintsugi = {
  value: "kintsugi",
  name: "Kintsugi",
  identity: "kintsugi",
  symbol: "KINT",
  voteSymbol: "vKINT",
  decimals: 12,
  hasElections: false,
  ss58Format: 2092,
  snsCoverCid: "bafybeifddx4p4ouofy2mj3pt5o62alnpfywbu7w7iedws3shpiu547tszi",
  endpoints: DEFAULT_KINTSUGI_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoKintsugiDark,
  navLogoDark: ProjectLogoKintsugiDark,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.Council]),
  hasSubscan: true,
  description:
    "Make your Bitcoin work for you with Kintsugi. Use your BTC for lending, borrowing, swapping and staking.",
  useVoteCall: true,
};

export default kintsugi;
