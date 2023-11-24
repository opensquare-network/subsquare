import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { PostLabel } from "./common";
import {
  ProjectIconWestendCollectivesDark,
  ProjectIconWestendCollectivesLight,
  ProjectLogoWestendCollectivesDark,
  ProjectLogoWestendCollectivesLight,
} from "@osn/icons/subsquare";

const westendCollectivesEndpoints = [
  {
    name: "Parity",
    url: "wss://westend-collectives-rpc.polkadot.io/",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://sys.ibp.network/collectives-westend",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://sys.dotters.network/collectives-westend",
  },
];

const westendCollectives = {
  value: Chains["westend-collectives"],
  name: "Collectives",
  identity: "westend",
  symbol: "WND",
  decimals: 12,
  blockTime: 12000,
  ss58Format: 42,
  snsCoverCid: "bafybeibtr7oelilpotm26qrnnp34ztbnde7ouu5fdflcx6f6dj6foyb5eq",
  endpoints: westendCollectivesEndpoints,
  avatar: ProjectIconWestendCollectivesLight,
  darkAvatar: ProjectIconWestendCollectivesDark,
  navLogo: ProjectLogoWestendCollectivesLight,
  navLogoDark: ProjectLogoWestendCollectivesDark,
  group: MenuGroups.Solochain,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  hasFellowship: true,
  hasTechComm: false,
  hasDemocracy: false,
  hasTreasury: false,
  showAccountManagementTab: false,
  cssVarsLight: {
    theme100: "rgba(239,72,106,0.10)",
    theme300: "rgba(239,72,106,0.40)",
    theme500: "rgba(239,72,106,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(239,72,106,0.10)",
    theme300: "rgba(239,72,106,0.40)",
    theme500: "rgba(239,72,106,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default westendCollectives;
