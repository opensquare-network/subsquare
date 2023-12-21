import Chains from "../chains";
import capitalize from "../../capitalize";
import Avatar from "../../../assets/icons/chain/development.png";
import MenuGroups from "./menuGroups";
import DarkAvatar from "../../../assets/icons/chain/development-dark.png";
import { defaultPostLabels } from "./common";

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
  identity: Chains.kusama,
  symbol: "UNIT",
  decimals: 12,
  hasElections: false,
  ss58Format: 42,
  snsCoverCid: "bafybeiatq3vybpj3dyxretnjzmggeukqqk3bc4r4qep2ol7cysctrtjqp4",
  endpoints: defaultNodes,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: MenuGroups.Solochain,
  hasStatescan: true,
  noIdentityModule: true,
  hasTechComm: false,
  blockTime: 3000,
  postLabels: defaultPostLabels,
};

export default development;
