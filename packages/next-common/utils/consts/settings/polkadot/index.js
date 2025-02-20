import capitalize from "../../../capitalize";
import Chains from "../../chains";
import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import dynamic from "next/dynamic";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";
import defaultPolkadotNodes from "next-common/utils/consts/settings/polkadot/nodes";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import polkadotTreasuryTracks from "next-common/utils/consts/settings/polkadot/tracks";
import { mergeChainModules } from "../common/modules";

const ProjectIconPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotDark"),
);
const ProjectIconPolkadotLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotLight"),
);
const ProjectLogoPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotDark"),
);
const ProjectLogoPolkadotLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotLight"),
);

const NetworkPolkadot = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPolkadotLight"),
);

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
  endpoints: defaultPolkadotNodes,
  avatar: ProjectIconPolkadotLight,
  darkAvatar: ProjectIconPolkadotDark,
  navLogo: ProjectLogoPolkadotLight,
  navLogoDark: ProjectLogoPolkadotDark,
  networkIcon: NetworkPolkadot,
  group: MenuGroups.PolkadotAndParachains,
  links: polkadotLinks,
  postLabels: defaultPostLabels,
  hasIdentityTimeline: true,
  graphqlApiSubDomain: "dot-gh-api",
  hasMultisig: true,
  multisigApiPrefix: "dot",
  useVoteCall: true,
  description:
    "Polkadot empowers blockchain networks to work together under the protection of shared security.",
  ...polkadotThemeVars,
  modules: mergeChainModules({
    whales: true,
    democracy: {
      archived: true,
    },
    referenda: true,
    treasury: {
      spends: true,
      childBounties: true,
      tips: {
        archived: true,
      },
    },
    council: {
      archived: true,
    },
    technicalCommittee: {
      archived: true,
    },
    coretime: true,
    assethub: true,
    vesting: true,
  }),
  integrations: {
    doTreasury: true,
    statescan: true,
    subscan: true,
    discourseForum: {
      link: "https://forum.polkadot.network",
    },
    polkassembly: {
      discussions: true,
    },
  },
  multisigWallets: {
    signet: true,
    mimir: true,
  },
  treasuryProposalTracks: polkadotTreasuryTracks,
  newProposalQuickStart: {
    usdxTreasuryProposal: true,
    spendDotOnAssetHubProposal: true,
    cancelReferendum: true,
    killReferendum: true,
  },
  sima: true,
};

export default polkadot;
