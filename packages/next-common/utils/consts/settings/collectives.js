import Logo from "../../../assets/header-logos/collectives.svg";
import DarkModeLogo from "../../../assets/header-logos/collectives-dark.svg";
import Avatar from "../../../assets/icons/chain/collectives.png";
import DarkAvatar from "../../../assets/icons/chain/collectives-dark.png";

import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { PostLabel } from "./common";
import {
  ProjectLogoPolkadotCollectivesDark,
  ProjectLogoPolkadotCollectivesLight,
} from "@osn/icons/subsquare";

const collectivesEndpoints = [
  {
    name: "OnFinality",
    url: "wss://collectives.api.onfinality.io/public-ws",
  },
  {
    name: "Parity",
    url: "wss://polkadot-collectives-rpc.polkadot.io/",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://sys.ibp.network/collectives-polkadot",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://sys.dotters.network/collectives-polkadot",
  },
];

const collectives = {
  value: Chains.collectives,
  name: "Collectives",
  identity: Chains.polkadot,
  symbol: "DOT",
  decimals: 10,
  ss58Format: 0,
  snsCoverCid: "bafybeigyl3p7ikczpt4an4diyynbqsco6oqxza47vf3o2jeinkumm5pwby",
  endpoints: collectivesEndpoints,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoPolkadotCollectivesLight,
  navLogoDark: ProjectLogoPolkadotCollectivesDark,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  hasFellowship: true,
  noDemocracy: true,
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
