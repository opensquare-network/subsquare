import capitalize from "../../capitalize";
import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconPolkadotDark,
  ProjectIconPolkadotLight,
  ProjectLogoPolkadotDark,
  ProjectLogoPolkadotLight,
} from "@osn/icons/subsquare";

const name = Chains.polkadot;

export const defaultPolkadotNodes = [
  {
    name: "Parity",
    url: "wss://rpc.polkadot.io",
  },
  {
    name: "Dwellir",
    url: "wss://polkadot-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://polkadot-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/dot",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/polkadot",
  },
  {
    name: "RadiumBlock",
    url: "wss://polkadot.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-polkadot.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://polkadot.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://polkadot.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/Polkadot",
  },
  {
    name: "reddit",
    url: "https://www.reddit.com/r/polkadot",
  },
  {
    name: "discord",
    url: "https://dot.li/discord",
  },
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot-sdk",
  },
  {
    name: "element",
    url: "https://matrix.to/#/#Polkadot-Direction:parity.io",
  },
];

const polkadot = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
  ss58Format: 0,
  blockTime: 6000,
  snsCoverCid: "bafybeifsztkok4p4vzjbhacvr2o4dxc5xgb7ynxsgnvmicttpqce34xdwe",
  endpoints: defaultPolkadotNodes,
  avatar: ProjectIconPolkadotLight,
  darkAvatar: ProjectIconPolkadotDark,
  navLogo: ProjectLogoPolkadotLight,
  navLogoDark: ProjectLogoPolkadotDark,
  group: MenuGroups.PolkadotAndParachains,
  links,
  postLabels: defaultPostLabels,
  hasReferenda: true,
  hasStatescan: true,
  hasSubscan: true,
  hasDotreasury: true,
  hasPolkassemblyDiscussions: true,
  hasDiscussionsForumTopics: true,
  hasMultisig: true,
  multisigApiPrefix: "dot",
  // used to control whether to show votes delegation percentage on referendum detail page.
  showReferendaReferendumDelegationPercentage: true,
  useVoteCall: true,
  showAchainableLabels: true,
  description:
    "Polkadot empowers blockchain networks to work together under the protection of shared security.",
  hideNewTreasuryProposalButton: true,
  noDemocracyModule: true,
  cssVarsLight: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default polkadot;
