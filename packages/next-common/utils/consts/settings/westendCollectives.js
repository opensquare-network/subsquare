import Logo from "../../../assets/header-logos/westend-collectives.svg";
import DarkModeLogo from "../../../assets/header-logos/westend-collectives-dark.svg";
import Avatar from "../../../assets/icons/chain/westend-collectives.png";
import DarkAvatar from "../../../assets/icons/chain/westend-collectives-dark.png";

import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { PostLabel } from "./common";
import {
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
  ss58Format: 42,
  snsCoverCid: "bafybeibtr7oelilpotm26qrnnp34ztbnde7ouu5fdflcx6f6dj6foyb5eq",
  endpoints: westendCollectivesEndpoints,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  navLogo: ProjectLogoWestendCollectivesLight,
  navLogoDark: ProjectLogoWestendCollectivesDark,
  group: MenuGroups.Solochain,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  hasFellowship: true,
};

export default westendCollectives;
