import dynamic from "next/dynamic";
import Chains from "../chains";
import { PostLabel } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";

//TODO: update hyperbridge icons
const ProjectIconHydrationDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHydrationDark"),
);
const ProjectIconHydrationLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHydrationLight"),
);
const ProjectLogoHydrationDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoHydrationDark"),
);

const endpoints = [
  {
    name: "IBP1",
    url: "wss://hydration.ibp.network/",
  },
  {
    name: "IBP2",
    url: "wss://nexus.dotters.network",
  },
  {
    name: "BlockOps",
    url: "wss://hyperbridge-nexus-rpc.blockops.network",
  },
];

const links = [
  {
    name: "website",
    url: "https://hyperbridge.network/",
  },
  {
    name: "twitter",
    url: "https://x.com/hyperbridge",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/WYTUQrTR9y",
  },
  {
    name: "telegram",
    url: "https://t.me/hyper_bridge",
  },
  {
    name: "github",
    url: "https://github.com/polytope-labs/hyperbridge",
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/playlist?list=PLBYmzMa52CEE4lBa8Sos6FsQb_SnkPhgl",
  },
];

const hyperBridge = {
  value: Chains.hyperBridge,
  domain: "hyperbridge",
  name: "HyperBridge",
  identity: Chains.polkadot,
  symbol: "BRIDGE",
  decimals: 12,
  blockTime: 6000,
  hasElections: false,
  ss58Format: 0,
  avatar: ProjectIconHydrationLight,
  darkAvatar: ProjectIconHydrationDark,
  navLogo: ProjectLogoHydrationDark,
  navLogoDark: ProjectLogoHydrationDark,
  navPreferDark: true,
  endpoints,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [PostLabel.Treasury],
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "hyperBridge",
  description: "Securely connecting blockchains for seamless asset transfer.",
  modules: mergeChainModules({
    referenda: true,
    treasury: {
      spends: true,
    },
  }),
  integrations: {
    subscan: {
      domain: "nexus",
    },
  },
  cssVarsLight: {
    theme100: "rgba(229,62,118,0.10)",
    theme300: "rgba(229,62,118,0.40)",
    theme500: "rgba(229,62,118,1)",
    navigationBg: "rgba(36,14,50,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.08)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(229,62,118,0.10)",
    theme300: "rgba(229,62,118,0.40)",
    theme500: "rgba(229,62,118,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "rgba(39,42,58,1)",
  },
  newProposalQuickStart: {
    treasurySpendProposal: true,
  },
  supportWalletconnect: true,
  allowWeb2Login: false,
  hotMenu: {
    referenda: true,
  },
};

export default hyperBridge;
