import dynamic from "next/dynamic";
import kusamaLinks from "next-common/utils/consts/settings/kusama/links";
import defaultKusamaNodes from "next-common/utils/consts/settings/kusama/nodes";
import kusamaTreasuryTracks from "next-common/utils/consts/settings/kusama/tracks";
import { defaultPostLabels } from "../common";
import MenuGroups from "../menuGroups";
import { mergeChainModules } from "../common/modules";
import kusamaCommonCfg from "next-common/utils/consts/settings/kusama/common";

const ProjectIconKusamaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaDark"),
);
const ProjectIconKusamaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconKusamaLight"),
);

const kusama = {
  value: "kusama",
  name: "Kusama",
  ...kusamaCommonCfg,
  hasElections: true,
  blockTime: 6000,
  endpoints: defaultKusamaNodes,
  avatar: ProjectIconKusamaLight,
  darkAvatar: ProjectIconKusamaDark,
  navPreferDark: true,
  group: MenuGroups.KusamaAndParachains,
  links: kusamaLinks,
  graphqlApiSubDomain: "ksm-gh-api",
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "kusama",
  description:
    "Kusama is a scalable multi-chain network for radical innovation and early stage Polkadot deployments. Expect Chaos. No promises.",
  modules: mergeChainModules({
    referenda: true,
    fellowship: true,
    whales: true,
    democracy: {
      archived: true,
    },
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
  treasuryProposalTracks: kusamaTreasuryTracks,
  newProposalQuickStart: {
    cancelReferendum: true,
    killReferendum: true,
  },
  sima: true,
};

export default kusama;
