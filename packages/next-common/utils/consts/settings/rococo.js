import capitalize from "../../capitalize";
import Logo from "../../../assets/header-logos/rococo.svg";
import DarkModeLogo from "../../../assets/header-logos/rococo-dark.svg";
import Avatar from "../../../assets/icons/chain/rococo.png";
import MenuGroups from "./menuGroups";
import Chains from "../chains";
import { defaultPostLabels } from "./common";

export const defaultRococoNodes = [
  {
    name: "Parity",
    url: "wss://rococo-rpc.polkadot.io",
  },
];

const name = Chains.rococo;

const rococo = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "ROC",
  decimals: 12,
  hasElections: true,
  ss58Format: 42,
  snsCoverCid: "bafybeia7np32r7cq2ykeeopfyxfgxhhsi2e4tl4bew4zjwu2zixiw2rx74",
  endpoints: defaultRococoNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
};

export default rococo;
