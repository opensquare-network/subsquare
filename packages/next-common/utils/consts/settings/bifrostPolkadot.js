import dynamic from "next/dynamic";
import Chains from "../chains";
import bifrost from "./bifrost";
import { defaultPostLabels } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";
import bifrostPreimageSettings from "next-common/utils/consts/settings/common/preimage/bifrost";
import bifrostPolkadotTracks from "./bifrostPolkadotTracks";

const ProjectIconBifrostPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBifrostPolkadotDark"),
);
const ProjectIconBifrostPolkadotLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconBifrostPolkadotLight"),
);
const ProjectLogoBifrostPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoBifrostPolkadotDark"),
);

const DEFAULT_NODES = [
  {
    name: "Liebi",
    url: "wss://hk.p.bifrost-rpc.liebi.com/ws",
  },
  {
    name: "LiebiEU",
    url: "wss://eu.bifrost-polkadot-rpc.liebi.com/ws",
  },
  {
    name: "IBP1",
    url: "wss://bifrost-polkadot.ibp.network",
  },
  {
    name: "IBP2",
    url: "wss://bifrost-polkadot.dotters.network",
  },
];

const links = bifrost.links;

const bifrostPolkadot = {
  value: Chains.bifrostPolkadot,
  name: "Bifrost Polkadot",
  hideHeight: false,
  identity: Chains.bifrostPolkadot,
  symbol: "BNC",
  decimals: 12,
  blockTime: 6000,
  hasElections: false,
  ss58Format: 0,
  endpoints: DEFAULT_NODES,
  avatar: ProjectIconBifrostPolkadotLight,
  darkAvatar: ProjectIconBifrostPolkadotDark,
  navLogo: ProjectLogoBifrostPolkadotDark,
  navLogoDark: ProjectLogoBifrostPolkadotDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "pbnc",
  description: bifrost.description,
  modules: mergeChainModules({
    referenda: true,
    fellowship: true,
    scheduler: true,
    treasury: {
      spends: true,
      bounties: false,
      tips: false,
    },
    vesting: true,
    democracy: {
      archived: true,
    },
    council: {
      archived: true,
    },
    technicalCommittee: {
      archived: true,
    },
  }),
  integrations: {
    subscan: {
      domain: "bifrost",
    },
  },
  referendaActions: {
    startFrom: 136,
  },
  cssVarsLight: {
    theme100: "rgba(84,43,251,0.10)",
    theme300: "rgba(84,43,251,0.40)",
    theme500: "rgba(84,43,251,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(84,43,251,0.10)",
    theme300: "rgba(84,43,251,0.40)",
    theme500: "rgba(84,43,251,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  multisigWallets: {
    mimir: true,
  },
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
  supportWalletconnect: true,
  allowWeb2Login: false,
  hotMenu: {
    referenda: true,
  },
  preimage: bifrostPreimageSettings,
  openSquare: {
    voting: "bifrost",
  },
  treasuryProposalTracks: bifrostPolkadotTracks,
};

export default bifrostPolkadot;
