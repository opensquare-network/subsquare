import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconHydradxDark,
  ProjectIconHydradxLight,
  ProjectLogoHydradxDark,
} from "@osn/icons/subsquare";

const defaultHydradxEndpoints = [
  {
    name: "Galactic Council",
    url: "wss://rpc.hydradx.cloud",
  },
  {
    name: "Dwellir",
    url: "wss://hydradx-rpc.dwellir.com",
  },
  {
    name: "OnFinality",
    url: "wss://hydradx.api.onfinality.io/public-ws",
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
  blockTime: 12000,
  hasElections: true,
  ss58Format: 63,
  snsCoverCid: "bafybeieqf3lmi5e4e3yqvujn7dd26dsvhy66u55g6gjzgvw2ogjzu2pt4e",
  avatar: ProjectIconHydradxLight,
  darkAvatar: ProjectIconHydradxDark,
  navLogo: ProjectLogoHydradxDark,
  navLogoDark: ProjectLogoHydradxDark,
  endpoints: defaultHydradxEndpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  useVoteCall: true,
  description:
    "HydraDX is a next-gen DeFi protocol which is designed to bring an ocean of liquidity to Polkadot. Our tool for the job the HydraDX Omnipool - an innovative Automated Market Maker (AMM) which unlocks unparalleled efficiencies by combining all assets in a single trading pool.",
  cssVarsLight: {
    theme100: "rgba(246,41,124,0.10)",
    theme300: "rgba(246,41,124,0.40)",
    theme500: "rgba(246,41,124,1)",
    navigationBg: "rgba(2,6,25,1)",
    navigationActive: "rgba(255,255,255,0.08)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(246,41,124,0.10)",
    theme300: "rgba(246,41,124,0.40)",
    theme500: "rgba(246,41,124,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default hydradx;
