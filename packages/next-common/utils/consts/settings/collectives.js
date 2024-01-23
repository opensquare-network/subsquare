import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { PostLabel } from "./common";
import {
  ProjectIconPolkadotCollectivesDark,
  ProjectIconPolkadotCollectivesLight,
  ProjectLogoPolkadotCollectivesDark,
  ProjectLogoPolkadotCollectivesLight,
} from "@osn/icons/subsquare";

const collectivesEndpoints = [
  {
    name: "Dewllir",
    url: "wss://polkadot-collectives-rpc.dwellir.com/",
  },
  {
    name: "Dewllir Tunisia",
    url: "wss://polkadot-collectives-rpc-tn.dwellir.com/",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://sys.ibp.network/collectives-polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://sys.dotters.network/collectives-polkadot",
  },
  {
    name: "Parity",
    url: "wss://polkadot-collectives-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://collectives.api.onfinality.io/public-ws",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-collectives-polkadot.luckyfriday.io",
  },
  {
    name: "RadiumBlock",
    url: "wss://collectives.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io/collectives",
  },
];

const collectives = {
  value: Chains.collectives,
  name: "Collectives",
  identity: Chains.polkadot,
  symbol: "DOT",
  decimals: 10,
  blockTime: 12000,
  ss58Format: 0,
  snsCoverCid: "bafybeigyl3p7ikczpt4an4diyynbqsco6oqxza47vf3o2jeinkumm5pwby",
  endpoints: collectivesEndpoints,
  avatar: ProjectIconPolkadotCollectivesLight,
  darkAvatar: ProjectIconPolkadotCollectivesDark,
  navLogo: ProjectLogoPolkadotCollectivesLight,
  navLogoDark: ProjectLogoPolkadotCollectivesDark,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  hasFellowship: true,
  hasFellowshipParams: true,
  hasPolkassemblyDiscussions: false,
  hasTechComm: false,
  hasDemocracy: false,
  hasTreasuryModule: false,
  hasTipsModule: false,
  hasDiscussionsRFCs: true,
  noDemocracy: true,
  noDemocracyModule: true,
  noIdentityModule: true,
  showAchainableLabels: true,
  description:
    "Collectives on Polkadot network. Polkadot Collectives Common Good Parachain",
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

export default collectives;
