import { collectiveLinks } from "next-common/utils/consts/settings/common/collectiveLinks";
import Chains from "../../chains";
import { PostLabel } from "../common";
import MenuGroups from "../menuGroups";
import { mergeChainModules } from "../common/modules";
import { collectivesEndpoints } from "./endpoints";
import { collectivesTreasuryTracks } from "./treasuryTracks";
import { collectivesThemes } from "./theme";

const collectives = {
  value: Chains.collectives,
  name: "Collectives",
  identity: Chains.polkadot,
  symbol: "DOT",
  decimals: 10,
  blockTime: 12000,
  ss58Format: 0,
  endpoints: collectivesEndpoints,
  links: collectiveLinks,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasFellowshipParams: true,
  hasIdentity: true,
  graphqlApiSubDomain: "dot-gh-api",
  graphql: {
    domain: "dot-gh-api",
    identity: true,
    multisig: false,
  },
  description: "Collectives on Polkadot network.",
  treasuryProposalTracks: collectivesTreasuryTracks,
  modules: mergeChainModules({
    fellowship: {
      core: true,
    },
    ambassador: true,
    democracy: false,
    fellowshipTreasury: true,
    treasury: false,
    council: false,
    technicalCommittee: false,
    alliance: true,
  }),
  integrations: {
    statescan: true,
    subscan: {
      domain: "collectives-polkadot",
    },
    discussionsRFCs: {
      link: "https://github.com/polkadot-fellows/RFCs/issues",
    },
  },
  multisigWallets: {
    mimir: true,
  },
  sima: true,
  allowWeb2Login: false,
  ...collectivesThemes,
};

export default collectives;
