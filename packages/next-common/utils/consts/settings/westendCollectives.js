import Logo from "../../../assets/header-logos/collectives.svg";
import DarkModeLogo from "../../../assets/header-logos/collectives-dark.svg";
import Avatar from "../../../assets/icons/chain/collectives.png";
import DarkAvatar from "../../../assets/icons/chain/collectives-dark.png";

import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { PostLabel } from "./common";

const westendCollectivesEndpoints = [
  {
    name: "Parity",
    url: "wss://westend-collectives-rpc.polkadot.io/",
  },
];

const westendCollectives = {
  value: Chains["westend-collectives"],
  name: "Collectives",
  identity: "westend",
  symbol: "WND",
  decimals: 12,
  ss58Format: 0,
  snsCoverCid: "bafybeibtr7oelilpotm26qrnnp34ztbnde7ouu5fdflcx6f6dj6foyb5eq",
  endpoints: westendCollectivesEndpoints,
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: DarkAvatar,
  group: MenuGroups.Solochain,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasStatescan: true,
  noSubscan: true,
};

export default westendCollectives;
