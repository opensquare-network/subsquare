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

const links = [
  {
    name: "website",
    url: "https://kusama-crowdloan.litentry.com/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/litentry",
  },
  {
    name: "telegram",
    url: "https://t.me/litentry",
  },
  {
    name: "github",
    url: "https://github.com/litentry",
  },
  {
    name: "medium",
    url: "https://litentry.medium.com/",
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
  links,
  group: MenuGroups.KusamaAndParachains,
  hasStatescan: true,
  hasSubscan: false,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  description: "Litmus is a companion canary network to Litentry and connects to the Kusama ecosystem as parachain.",
};

export default litmus;
