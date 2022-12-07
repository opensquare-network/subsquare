import Logo from "../../../assets/header-logos/hydradx.svg";
import Chains from "../chains";
import Avatar from "../../../assets/icons/chain/hydradx.png";
import MenuGroups from "./menuGroups";

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
  headerBackgroundColor: "#000000",
  loginButtonPrimary: true,
  headerLogo: Logo,
  darkHeaderLogo: Logo,
  avatar: Avatar,
  darkAvatar: Avatar,
  endpoints: defaultHydradxEndpoints,
  group: MenuGroups.PolkadotAndParachains,
};

export default hydradx;
