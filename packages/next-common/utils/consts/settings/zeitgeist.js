import Logo from "../../../assets/header-logos/zeitgeist.svg";
import DarkModeLogo from "../../../assets/header-logos/zeitgeist-dark.svg";
import Avatar from "../../../assets/icons/chain/zeitgeist.png";
import DarkAvatar from "../../../assets/icons/chain/zeitgeist-dark.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels, PostLabel } from "./common";
import { ProjectLogoZeigeistDark } from "@osn/icons/subsquare";

const defaultNodes = [
  {
    name: "OnFinality",
    url: "wss://zeitgeist.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://zeitgeist-rpc.dwellir.com",
  },
  {
    name: "ZeitgeistPM",
    url: "wss://main.rpc.zeitgeist.pm/ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://zeitgeist.pm",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/xv8HuA4s8v",
  },
  {
    name: "github",
    url: "https://github.com/ZeitgeistPM",
  },
  {
    name: "twitter",
    url: "https://twitter.com/ZeitgeistPM",
  },
];

const zeitgeist = {
  value: Chains.zeitgeist,
  name: capitalize(Chains.zeitgeist),
  identity: Chains.zeitgeist,
  symbol: "ZTG",
  decimals: 10,
  hasElections: false,
  ss58Format: 73,
  blockTime: 12000,
  snsCoverCid: "bafybeifwpcjcbym2df3zuh63p4nowvh53d6hgludiwvlsnusxckyke5sri",
  endpoints: defaultNodes,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoZeigeistDark,
  navLogoDark: ProjectLogoZeigeistDark,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [...defaultPostLabels, PostLabel.Advisory, "ZIP", "Court"],
  hasSubscan: true,
  useVoteCall: true,
};

export default zeitgeist;
