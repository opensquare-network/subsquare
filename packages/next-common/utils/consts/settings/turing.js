import Logo from "../../../assets/header-logos/turing.svg";
import DarkModeLogo from "../../../assets/header-logos/turing-dark.svg";
import Avatar from "../../../assets/icons/chain/turing.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoTuringDark } from "@osn/icons/subsquare";

export const DEFAULT_TURING_NODES = [
  {
    name: "OAK",
    url: "wss://rpc.turing.oak.tech",
  },
  {
    name: "Dwellir",
    url: "wss://turing-rpc.dwellir.com",
  },
];

const turing = {
  value: Chains.turing,
  name: capitalize(Chains.turing),
  identity: Chains.turing,
  symbol: "TUR",
  decimals: 10,
  hasElections: false,
  ss58Format: 51,
  snsCoverCid: "bafybeidmqvyfi467agi4cum26idgh5h56wmegrjh7jnl5wvtkzbvgucmpm",
  endpoints: DEFAULT_TURING_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoTuringDark,
  navLogoDark: ProjectLogoTuringDark,
  group: MenuGroups.KusamaAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default turing;
