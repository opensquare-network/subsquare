import Logo from "../../../assets/header-logos/litentry.svg";
import Avatar from "../../../assets/icons/chain/litentry.png";

import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";

const DEFAULT_LITENTRY_NODES = [
  {
    name: "Litentry",
    url: "wss://rpc.litentry-parachain.litentry.io/",
  },
  {
    name: "Dwellir",
    url: "wss://litentry-rpc.dwellir.com/"
  },
];

const litentry = {
  value: Chains.litentry,
  name: capitalize(Chains.litentry),
  identity: Chains.polkadot,
  symbol: "LIT",
  decimals: 12,
  hasElections: false,
  ss58Format: 31,
  snsCoverCid: "bafybeiej7his75nmaf2yhm6n3sqxf3ew2kvkyb7q37pbt37b72jwvs5cu4",
  endpoints: DEFAULT_LITENTRY_NODES,
  loginButtonPrimary: true,
  headerBackgroundColor: "#000000",
  headerLogo: Logo,
  darkHeaderLogo: Logo,
  avatar: Avatar,
  group: MenuGroups.PolkadotAndParachains,
  hasStatescan: true,
  noSubscan: true,
};

export default litentry;
