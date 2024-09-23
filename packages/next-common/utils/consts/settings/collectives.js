import dynamic from "next/dynamic";
import { collectiveLinks } from "next-common/utils/consts/settings/common/collectiveLinks";
import { polkadotThemeVars } from "next-common/utils/consts/settings/common/polkadot";
import Chains from "../chains";
import { PostLabel } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";

const ProjectIconPolkadotCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCollectivesDark"),
);
const ProjectIconPolkadotCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPolkadotCollectivesLight"),
);
const ProjectLogoPolkadotCollectivesDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotCollectivesDark"),
);
const ProjectLogoPolkadotCollectivesLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPolkadotCollectivesLight"),
);

const collectivesEndpoints = [
  {
    name: "Parity",
    url: "wss://polkadot-collectives-rpc.polkadot.io",
  },
  {
    name: "IBP1",
    url: "wss://sys.ibp.network/collectives-polkadot",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-collectives-polkadot.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://collectives.api.onfinality.io/public-ws",
  },
  {
    name: "Dewllir",
    url: "wss://polkadot-collectives-rpc.dwellir.com",
  },
  {
    name: "Dewllir Tunisia",
    url: "wss://polkadot-collectives-rpc-tn.dwellir.com/",
  },
  {
    name: "IBP2",
    url: "wss://sys.dotters.network/collectives-polkadot",
  },
  {
    name: "RadiumBlock",
    url: "wss://collectives.public.curie.radiumblock.co/ws",
  },
  {
    name: "Stakeworld",
    url: "wss://dot-rpc.stakeworld.io/collectives",
  },
];

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
  avatar: ProjectIconPolkadotCollectivesLight,
  darkAvatar: ProjectIconPolkadotCollectivesDark,
  navLogo: ProjectLogoPolkadotCollectivesLight,
  navLogoDark: ProjectLogoPolkadotCollectivesDark,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: [PostLabel.Motion, PostLabel.Announcement],
  hasFellowshipParams: true,
  noIdentityModule: true,
  showAchainableLabels: true,
  description: "Collectives on Polkadot network.",
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
  ...polkadotThemeVars,
};

export default collectives;
