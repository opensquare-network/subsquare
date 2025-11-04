import capitalize from "../../../capitalize";
import Chains from "../../chains";
import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import dynamic from "next/dynamic";
import defaultPolkadotNodes from "next-common/utils/consts/settings/polkadot/nodes";
import polkadotLinks from "next-common/utils/consts/settings/polkadot/links";
import polkadotTreasuryTracks from "next-common/utils/consts/settings/polkadot/tracks";
import { mergeChainModules } from "../common/modules";
import polkadotCommonCfg, {
  polkadotAssethubMigration,
} from "next-common/utils/consts/settings/polkadot/common";
import polkadotPreimageSettings from "next-common/utils/consts/settings/common/preimage/polkadot";
import polkadotAssetHubNodes from "next-common/utils/consts/settings/polkadotAssetHub/endpoints";

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
  assethubBlockTime: 12000,
  assethubMigration: polkadotAssethubMigration,
  endpoints: polkadotAssetHubNodes,
  relayChainEndpoints: defaultPolkadotNodes,
  avatar: ProjectIconPolkadotLight,
  darkAvatar: ProjectIconPolkadotDark,
  networkIcon: NetworkPolkadot,
  group: MenuGroups.PolkadotAndParachains,
  links: polkadotLinks,
  postLabels: defaultPostLabels,
  hasIdentity: true,
  graphqlApiSubDomain: "dot-gh-api",
  graphql: {
    domain: "dot-gh-api",
    identity: true,
    multisig: false,
  },
  subsquareGraphql: {
    domain: "polkadot-gh-api",
    coretime: true,
    intime: {
      preimage: true,
      proxy: true,
    },
  },
  hasMultisig: true,
  multisigApiPrefix: "ahp-gh-api",
  useVoteCall: true,
  description:
    "Polkadot empowers blockchain networks to work together under the protection of shared security.",
  modules: mergeChainModules({
    whales: true,
    democracy: {
      archived: true,
    },
    referenda: {
      displayTreasuryRequesting: true,
    },
    treasury: {
      status: true,
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
    whitelist: true,
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
  allowWeb2Login: true,
  preimage: polkadotPreimageSettings,
  hotMenu: {
    referenda: true,
  },
  referendaActions: {
    startFrom: 1584,
  },
  supportWalletconnect: true,
  openSquare: {
    voting: "polkadot",
  },
  ecoNews: true,
  translations: {
    referenda: true,
  },
  supportForeignAssets: true,
  supportAssets: true,
  bountyIdentity: true,
};

export default polkadot;
