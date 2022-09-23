import Logo from "../../../assets/header-logos/litmus.svg";
import Avatar from "../../../assets/icons/chain/litmus.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import OptionGroups from "./menuGroups";

const DEFAULT_LITMUS_NODES = [
  {
    name: "Litentry",
    url: "wss://rpc.litmus-parachain.litentry.io",
  },
];

const litmus = {
  value: Chains.litmus,
  name: capitalize(Chains.litmus),
  icon: "litmus.svg",
  identity: Chains.kusama,
  symbol: "LIT",
  decimals: 12,
  hasElections: false,
  ss58Format: 131,
  snsCoverCid: "bafybeiexfrkdte6eruqghlc66xpnfoyadkgq5we3ql5elqjwgdzbxmez6q",
  endpoints: DEFAULT_LITMUS_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: Logo,
  avatar: Avatar,
  group: OptionGroups.KusamaAndParachains,
};

export default litmus;
