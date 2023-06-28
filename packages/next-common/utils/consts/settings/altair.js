import Chains from "../chains";
import capitalize from "../../capitalize";
import Logo from "../../../assets/header-logos/altair.svg";
import DarkModeLogo from "../../../assets/header-logos/altair-dark.svg";
import Avatar from "../../../assets/icons/chain/altair.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import difference from "lodash.difference";
import { ProjectLogoAltairDark } from "@osn/icons/subsquare";

const nodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.altair.centrifuge.io",
  },
];

const links = [
  {
    name: "twitter",
    url: "https://twitter.com/altair_network",
  },
  {
    name: "medium",
    url: "https://medium.com/altair-network",
  },
];

const altair = {
  value: Chains.altair,
  name: capitalize(Chains.altair),
  identity: Chains.altair,
  symbol: "AIR",
  decimals: 18,
  hasElections: true,
  ss58Format: 136,
  snsCoverCid: "bafybeidmyuzahzhhsxk5yeofehqj3y2yhj5wn5n4xqblx3j4kczytvnvs4",
  endpoints: nodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  navLogo: ProjectLogoAltairDark,
  navLogoDark: ProjectLogoAltairDark,
  links,
  group: MenuGroups.KusamaAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.TechComm]),
  hasSubscan: true,
};

export default altair;
