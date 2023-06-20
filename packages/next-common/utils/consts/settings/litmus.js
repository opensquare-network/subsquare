import Logo from "../../../assets/header-logos/litmus.svg";
import DarkModeLogo from "../../../assets/header-logos/litmus-dark.svg";
import Avatar from "../../../assets/icons/chain/litmus.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoLitmusDark } from "@osn/icons/subsquare";

const DEFAULT_LITMUS_NODES = [
  {
    name: "Litentry",
    url: "wss://rpc.litmus-parachain.litentry.io",
  },
];

const litmus = {
  value: Chains.litmus,
  name: capitalize(Chains.litmus),
  identity: Chains.kusama,
  symbol: "LIT",
  decimals: 12,
  hasElections: false,
  ss58Format: 131,
  snsCoverCid: "bafybeiexfrkdte6eruqghlc66xpnfoyadkgq5we3ql5elqjwgdzbxmez6q",
  endpoints: DEFAULT_LITMUS_NODES,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoLitmusDark,
  navLogoDark: ProjectLogoLitmusDark,
  group: MenuGroups.KusamaAndParachains,
  hasStatescan: true,
  hasSubscan: false,
  postLabels: defaultPostLabels,
  useVoteCall: true,
};

export default litmus;
