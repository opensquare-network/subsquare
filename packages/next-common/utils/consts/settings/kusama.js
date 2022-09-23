import Logo from "../../../assets/header-logos/kusama.svg";
import DarkModeLogo from "../../../assets/header-logos/kusama-dark.svg";
import Avatar from "../../../assets/icons/chain/kusama.png";
import DarkAvatar from "../../../assets/icons/chain/kusama-dark.png";
import OptionGroups from "./menuGroups";

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
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
];

const kusama = {
  value: "kusama",
  name: "Kusama",
  icon: "kusama.svg",
  identity: "kusama",
  symbol: "KSM",
  decimals: 12,
  hasElections: true,
  ss58Format: 2,
  blockTime: 6000,
  snsCoverCid: "bafybeifrjrzaajdpfwbxtffsexnxwehsqc3k4ruk5oummlghsxvaityiku",
  endpoints: DEFAULT_KUSAMA_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: OptionGroups.KusamaAndParachains,
};

export default kusama;
