import capitalize from "../../../capitalize";
import Chains from "../../chains";
import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import dynamic from "next/dynamic";
import defaultPolkadotNodes from "next-common/utils/consts/settings/polkadot/nodes";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import polkadotTreasuryTracks from "next-common/utils/consts/settings/polkadot/tracks";
import { mergeChainModules } from "../common/modules";
import polkadotCommonCfg from "next-common/utils/consts/settings/polkadot/common";

const ProjectIconPolkadotDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotDark"),
);
const ProjectIconPolkadotLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotLight"),
);

const NetworkPolkadot = dynamic(() =>
  import("@osn/icons/subsquare/NetworkPolkadotLight"),
);

const name = Chains.polkadot;

const polkadot = {
  value: name,
  name: capitalize(name),
  ...polkadotCommonCfg,
  hasElections: true,
  blockTime: 6000,
  endpoints: defaultPolkadotNodes,
  avatar: ProjectIconPolkadotLight,
  darkAvatar: ProjectIconPolkadotDark,
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
    people: true,
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
