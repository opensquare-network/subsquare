import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import {
  ProjectIconKusamaDark,
  ProjectIconKusamaLight,
  ProjectLogoKusamaDark,
} from "@osn/icons/subsquare";
import defaultKusamaNodes from "next-common/utils/consts/settings/kusama/nodes";
import kusamaTreasuryTracks from "next-common/utils/consts/settings/kusama/tracks";
import kusamaLinks from "next-common/utils/consts/settings/kusama/links";

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
  endpoints: defaultKusamaNodes,
  avatar: ProjectIconKusamaLight,
  darkAvatar: ProjectIconKusamaDark,
  navLogo: ProjectLogoKusamaDark,
  navLogoDark: ProjectLogoKusamaDark,
  navPreferDark: true,
  group: MenuGroups.KusamaAndParachains,
  links: kusamaLinks,
  hasStatescan: true,
  hasSubscan: true,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasDotreasury: true,
  hasPolkassemblyDiscussions: true,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://forum.polkadot.network",
  hasMultisig: true,
  hasTipsModule: false,
  multisigApiPrefix: "kusama",
  showAchainableLabels: true,
  description:
    "Kusama is a scalable multi-chain network for radical innovation and early stage Polkadot deployments. Expect Chaos. No promises.",
  modules: {
    referenda: true,
    fellowship: true,
    whales: true,
  },
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
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  treasuryProposalTracks: kusamaTreasuryTracks,
};

export default kusama;
