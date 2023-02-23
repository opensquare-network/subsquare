import Logo from "../../../assets/header-logos/collectives.svg";
import DarkModeLogo from "../../../assets/header-logos/collectives-dark.svg";
import Avatar from "../../../assets/icons/chain/collectives.png";
import DarkAvatar from "../../../assets/icons/chain/collectives-dark.png";

import Chains from "../chains";
import MenuGroups from "./menuGroups";

const collectivesEndpoints = [
  {
    name: "OnFinality",
    url: "wss://collectives.api.onfinality.io/public-ws",
  },
  {
    name: "Parity",
    url: "wss://polkadot-collectives-rpc.polkadot.io/",
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
  group: MenuGroups.PolkadotAndParachains,
  postLabels: ["Motion", "Announcement"],
};

export default collectives;
