import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";
import { astarLinks, astarThemeVars } from "./common/astar";
import { mergeChainModules } from "./common/modules";
import ChainTypes from "../chainTypes";

const ProjectIconAstarDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAstarDark"),
);
const ProjectIconAstarLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAstarLight"),
);
const ProjectLogoAstarDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAstarDark"),
);
const ProjectLogoAstarLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAstarLight"),
);

const nodes = [
  {
    name: "Astar",
    url: "wss://rpc.astar.network",
  },
  {
    name: "Blast",
    url: "wss://astar.public.blastapi.io",
  },
  {
    name: "Dwellir",
    url: "wss://astar-rpc.dwellir.com",
  },
  {
    name: "Automata 1RPC",
    url: "wss://1rpc.io/astr",
  },
  {
    name: "OnFinality",
    url: "wss://astar.api.onfinality.io/public-ws",
  },
  {
    name: "RadiumBlock",
    url: "wss://astar.public.curie.radiumblock.co/ws",
  },
];

const ethereumNetwork = {
  chainId: "0x250",
  chainName: "Astar",
  rpcUrls: ["https://evm.astar.network/"],
  blockExplorerUrls: ["https://astar.blockscout.com/"],
  nativeCurrency: {
    symbol: "ASTR",
    decimals: 18,
  },
};

const astar = {
  value: Chains.astar,
  name: capitalize(Chains.astar),
  identity: Chains.astar,
  symbol: "ASTR",
  decimals: 18,
  blockTime: 6000,
  ss58Format: 5,
  endpoints: nodes,
  avatar: ProjectIconAstarLight,
  darkAvatar: ProjectIconAstarDark,
  navLogo: ProjectLogoAstarLight,
  navLogoDark: ProjectLogoAstarDark,
  navPreferDark: true,
  links: astarLinks,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  description: "A Scalable Network Powering a Global Web3 Vision for All.",
  chainType: ChainTypes.MIXED,
  ethereumNetwork,
  modules: mergeChainModules({
    treasury: {
      bounties: false,
      tips: false,
    },
    communityCouncil: true,
    communityTreasury: true,
    technicalCommittee: true,
    vesting: true,
  }),
  integrations: {
    subscan: true,
  },
  showNewTreasuryProposalButton: true,
  sima: true,
  allowWeb2Login: false,
  ...astarThemeVars,
};

export default astar;
