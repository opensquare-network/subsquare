import Logo from "../../../assets/header-logos/centrifuge.svg";
import DarkModeLogo from "../../../assets/header-logos/centrifuge-dark.svg";
import Avatar from "../../../assets/icons/chain/centrifuge.png";
import DarkAvatar from "../../../assets/icons/chain/centrifuge-dark.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import difference from "lodash.difference";
import {
  ProjectLogoCentrifugeDark,
  ProjectLogoCentrifugeLight,
} from "@osn/icons/subsquare";

const name = Chains.centrifuge;

export const defaultNodes = [
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
];

// centrifuge network social links
const links = [
  {
    name: "website",
    url: "https://centrifuge.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/centrifuge",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/yEzyUq5gxF",
  },
  {
    name: "github",
    url: "https://github.com/centrifuge/",
  },
];

const centrifuge = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "CFG",
  decimals: 18,
  hasElections: true,
  ss58Format: 36,
  snsCoverCid: "bafybeigik7gv4e2tasibkgjhvlfyjzdlbw4p33x6o64jhdypmgqhmo3a54",
  endpoints: defaultNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoCentrifugeLight,
  navLogoDark: ProjectLogoCentrifugeDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.TechComm]),
  hasSubscan: true,
  description: "Real-world DeFi: The on-chain ecosystem for structured credit.",
};

export default centrifuge;
