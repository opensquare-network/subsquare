import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import {
  ProjectIconKusamaDark,
  ProjectIconKusamaLight,
  ProjectLogoKusamaDark,
} from "@osn/icons/subsquare";

const DEFAULT_KUSAMA_NODES = [
  {
    name: "Parity",
    url: "wss://kusama-rpc.polkadot.io",
  },
  {
    name: "OnFinality",
    url: "wss://kusama.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://kusama-rpc.dwellir.com",
  },
  {
    name: "Dwellir Tunisia",
    url: "wss://kusama-rpc-tn.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/ksm",
  },
  {
    name: "IBP-GeoDNS1",
    url: "wss://rpc.ibp.network/kusama",
  },
  {
    name: "IBP-GeoDNS2",
    url: "wss://rpc.dotters.network/kusama",
  },
  {
    name: "RadiumBlock",
    url: "wss://kusama.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://ksm-rpc.stakeworld.io",
  },
];

const links = [
  {
    name: "website",
    url: "https://kusama.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/kusamanetwork",
  },
  {
    name: "discord",
    url: "https://kusa.ma/discord",
  },
  {
    name: "github",
    url: "https://github.com/paritytech/polkadot/",
  },
  {
    name: "element",
    url: "https://matrix.to/#/#Kusama-Direction:parity.io",
  },
  {
    name: "telegram",
    url: "https://t.me/kusamanetworkofficial",
  },
];

const kusama = {
  value: "kusama",
  name: "Kusama",
  identity: "kusama",
  symbol: "KSM",
  decimals: 12,
  hasElections: true,
  ss58Format: 2,
  blockTime: 6000,
  snsCoverCid: "bafybeifrjrzaajdpfwbxtffsexnxwehsqc3k4ruk5oummlghsxvaityiku",
  endpoints: DEFAULT_KUSAMA_NODES,
  avatar: ProjectIconKusamaLight,
  darkAvatar: ProjectIconKusamaDark,
  navLogo: ProjectLogoKusamaDark,
  navLogoDark: ProjectLogoKusamaDark,
  navPreferDark: true,
  group: MenuGroups.KusamaAndParachains,
  links,
  hasReferenda: true,
  hasFellowship: true,
  hasStatescan: true,
  hasSubscan: true,
  postLabels: defaultPostLabels,
  hasDemocracy: false,
  noDemocracyModule: true,
  useVoteCall: true,
  hasDotreasury: true,
  hasPolkassemblyDiscussions: true,
  hasMultisig: true,
  hasTipsModule: false,
  multisigApiPrefix: "kusama",
  // used to control whether to show votes delegation percentage on referendum detail page.
  showReferendaReferendumDelegationPercentage: true,
  showAchainableLabels: true,
  description:
    "Kusama is a scalable multi-chain network for radical innovation and early stage Polkadot deployments. Expect Chaos. No promises.",
  hideNewTreasuryProposalButton: true,
  cssVarsLight: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

export default kusama;
