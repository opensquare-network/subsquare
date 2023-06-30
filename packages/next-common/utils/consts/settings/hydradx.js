import Logo from "../../../assets/header-logos/hydradx.svg";
import DarkModeLogo from "../../../assets/header-logos/hydradx-dark.svg";
import Chains from "../chains";
import Avatar from "../../../assets/icons/chain/hydradx.png";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import { ProjectLogoHydradxDark } from "@osn/icons/subsquare";

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

const links = [
  {
    name: "website",
    url: "https://hydradx.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/hydra_dx",
  },
  {
    name: "discord",
    url: "https://discord.gg/kkmY35UxAG",
  },
  {
    name: "telegram",
    url: "https://t.me/hydradx",
  },
  {
    name: "reddit",
    url: "https://www.reddit.com/r/hdx/",
  },
  {
    name: "github",
    url: "https://github.com/galacticcouncil",
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
  navLogo: ProjectLogoHydradxDark,
  navLogoDark: ProjectLogoHydradxDark,
  endpoints: defaultHydradxEndpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  useVoteCall: true,
  description: "HydraDX is a next-gen DeFi protocol which is designed to bring an ocean of liquidity to Polkadot. Our tool for the job the HydraDX Omnipool - an innovative Automated Market Maker (AMM) which unlocks unparalleled efficiencies by combining all assets in a single trading pool.",
};

export default hydradx;
