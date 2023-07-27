import Chains from "next-common/utils/consts/chains";
import capitalize from "next-common/utils/capitalize";
import Avatar from "../../../assets/icons/chain/vara.png";
import {
  ProjectLogoVaraDark,
  ProjectLogoVaraLight,
} from "@osn/icons/subsquare";
import { defaultPostLabels } from "next-common/utils/consts/settings/common";
import MenuGroups from "next-common/utils/consts/settings/menuGroups";

const nodes = [
  {
    name: "Vara",
    url: "wss://archive-rpc.vara-network.io/",
  },
];

const links = [
  {
    name: "website",
    url: "https://vara-network.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/VaraNetwork",
  },
  {
    name: "discord",
    url: "https://discord.gg/x8ZeSy6S6K",
  },
  {
    name: "github",
    url: "https://github.com/gear-foundation",
  },
  {
    name: "medium",
    url: "https://medium.com/@VaraNetwork",
  },
  {
    name: "telegram",
    url: "https://t.me/VaraNetwork_Global",
  },
];

const name = Chains.vara;

const vara = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "VARA",
  decimals: 12,
  hasElections: false,
  ss58Format: 137,
  blockTime: 3000,
  snsCoverCid: "bafybeigeeecghmad3ap7alskf5mlifu7got2rbwcyya7qh6m6opgnd34gq",
  endpoints: nodes,
  links,
  avatar: Avatar,
  navLogo: ProjectLogoVaraLight,
  navLogoDark: ProjectLogoVaraDark,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  hasReferenda: true,
  hasFellowship: true,
  hasStatescan: false,
  hasSubscan: true,
  hasDotreasury: false,
  // used to control whether to show votes delegation percentage on referendum detail page.
  showReferendaReferendumDelegationPercentage: true,
  useVoteCall: true,
  description:
    "Vara is an ultra-fast and scalable Layer-1 decentralized network powered by the Gear Protocol.",
};

export default vara;
