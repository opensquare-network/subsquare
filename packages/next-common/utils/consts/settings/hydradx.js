import Logo from "../../../assets/header-logos/hydradx.svg";
import DarkModeLogo from "../../../assets/header-logos/hydradx-dark.svg";
import Chains from "../chains";
import Avatar from "../../../assets/icons/chain/hydradx.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";

const defaultHydradxEndpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://hydradx-rpc.dwellir.com",
  },
];

const hydradx = {
  value: Chains.hydradx,
  name: "HydraDX",
  identity: "hydradx",
  symbol: "HDX",
  decimals: 12,
  hasElections: true,
  ss58Format: 63,
  snsCoverCid: "bafybeieqf3lmi5e4e3yqvujn7dd26dsvhy66u55g6gjzgvw2ogjzu2pt4e",
  headerLogo: Logo,
  darkHeaderLogo: DarkModeLogo,
  avatar: Avatar,
  darkAvatar: Avatar,
  endpoints: defaultHydradxEndpoints,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
};

export default hydradx;
