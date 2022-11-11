import Chains from "../chains";
import capitalize from "../../capitalize";
import Logo from "../../../assets/header-logos/development.svg";
import DarkModeLogo from "../../../assets/header-logos/development-dark.svg";
import Avatar from "../../../assets/icons/chain/development.png";
import MenuGroups from "./menuGroups";
import DarkAvatar from "../../../assets/icons/chain/development-dark.png";

const name = Chains.development;

export const defaultNodes = [
  {
    name: "Litentry",
    url: "wss://governance2-testnet.litentry.io",
  },
];

const development = {
  value: name,
  name: capitalize(name),
  icon: "polkadot.svg",
  identity: Chains.kusama,
  symbol: "UNIT",
  decimals: 12,
  hasElections: false,
  ss58Format: 42,
  snsCoverCid: "bafybeiatq3vybpj3dyxretnjzmggeukqqk3bc4r4qep2ol7cysctrtjqp4",
  endpoints: defaultNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: MenuGroups.Solochain,
  noSubscan: true,
  blockTime: 3000,
};

export default development;
