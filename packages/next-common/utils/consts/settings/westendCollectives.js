import dynamic from "next/dynamic";
import { collectiveLinks } from "next-common/utils/consts/settings/common/collectiveLinks";
import Chains from "../chains";
import { PostLabel } from "./common";
import MenuGroups from "./menuGroups";

const ProjectIconWestendCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendCollectivesDark"),
);
const ProjectIconWestendCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconWestendCollectivesLight"),
);
const ProjectLogoWestendCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendCollectivesDark"),
);
const ProjectLogoWestendCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoWestendCollectivesLight"),
);

const westendCollectivesEndpoints = [
  {
    name: "Parity",
    url: "wss://westend-collectives-rpc.polkadot.io/",
  },
  {
    name: "IBP1",
    url: "wss://sys.ibp.network/collectives-westend",
  },
  {
    name: "Dwellir",
    url: "wss://collectives-westend-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://westend-collectives-rpc-tn.dwellir.com",
  },
  {
    name: "IBP2",
    url: "wss://sys.dotters.network/collectives-westend",
  },
];

const westendCollectives = {
  value: Chains.westendCollectives,
  name: "Collectives",
  identity: Chains.westend,
  symbol: "WND",
  decimals: 12,
  blockTime: 12000,
  ss58Format: 42,
  endpoints: westendCollectivesEndpoints,
  links: collectiveLinks,
  avatar: ProjectIconWestendCollectivesLight,
  darkAvatar: ProjectIconWestendCollectivesDark,
  navLogo: ProjectLogoWestendCollectivesLight,
  navLogoDark: ProjectLogoWestendCollectivesDark,
  group: MenuGroups.WestendAndParachains,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  hasFellowship: true,
  hasFellowshipCore: true,
  hasTechComm: false,
  hasTreasury: false,
  hasTreasuryModule: false,
  noIdentityModule: true,
  modules: {
    fellowship: true,
  },
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
