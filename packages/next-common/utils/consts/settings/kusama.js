import Logo from "../../../assets/header-logos/kusama.svg";
import DarkModeLogo from "../../../assets/header-logos/kusama-dark.svg";
import Avatar from "../../../assets/icons/chain/kusama.png";
import DarkAvatar from "../../../assets/icons/chain/kusama-dark.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoKusamaDark } from "@osn/icons/subsquare";

const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://kusama-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://kusama-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/ksm",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/kusama",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/kusama",
  },
  {
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://kusama.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/kusamanetwork",
  },
  {
    name: "discord",
    url: "https://kusa.ma/discord",
  },
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot/",
  },
];

const kusama = {
  value: "kusama",
  name: "Kusama",
  identity: "kusama",
  symbol: "KSM",
  decimals: 12,
  hasElections: true,
  ss58Format: 2,
  blockTime: 6000,
  snsCoverCid: "bafybeifrjrzaajdpfwbxtffsexnxwehsqc3k4ruk5oummlghsxvaityiku",
  endpoints: DEFAULT_KUSAMA_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: <ProjectLogoKusamaDark />,
  navLogoDark: <ProjectLogoKusamaDark />,
  group: MenuGroups.KusamaAndParachains,
  links,
  hasGov2: true,
  hasStatescan: true,
  hasSubscan: true,
  postLabels: defaultPostLabels,
  hasDemocracy: false,
  hasDotreasury: true,
};

export default kusama;
