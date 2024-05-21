import capitalize from "../../../capitalize";
import Chains from "../../chains";
import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import {
  ProjectIconPolkadotDark,
  ProjectIconPolkadotLight,
  ProjectLogoPolkadotDark,
  ProjectLogoPolkadotLight,
} from "@osn/icons/subsquare";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";
import defaultPolkadotNodes from "next-common/utils/consts/settings/polkadot/nodes";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import polkadotTreasuryTracks from "next-common/utils/consts/settings/polkadot/tracks";

const name = Chains.polkadot;

const polkadot = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "DOT",
  decimals: 10,
  hasElections: true,
  ss58Format: 0,
  blockTime: 6000,
  snsCoverCid: "bafybeifsztkok4p4vzjbhacvr2o4dxc5xgb7ynxsgnvmicttpqce34xdwe",
  endpoints: defaultPolkadotNodes,
  avatar: ProjectIconPolkadotLight,
  darkAvatar: ProjectIconPolkadotDark,
  navLogo: ProjectLogoPolkadotLight,
  navLogoDark: ProjectLogoPolkadotDark,
  group: MenuGroups.PolkadotAndParachains,
  links: polkadotLinks,
  postLabels: defaultPostLabels,
  hasStatescan: true,
  hasIdentityTimeline: true,
  identityApiSubDomain: "dot-gh-api",
  hasSubscan: true,
  hasDotreasury: true,
  hasPolkassemblyDiscussions: true,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://forum.polkadot.network",
  hasMultisig: true,
  multisigApiPrefix: "dot",
  useVoteCall: true,
  showAchainableLabels: false,
  description:
    "Polkadot empowers blockchain networks to work together under the protection of shared security.",
  hideNewTreasuryProposalButton: true,
  ...polkadotThemeVars,
  modules: {
    referenda: true,
    whales: true,
  },
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  treasuryProposalTracks: polkadotTreasuryTracks,
};

export default polkadot;
