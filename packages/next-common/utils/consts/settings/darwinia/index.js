import Chains from "../../chains";
import capitalize from "../../../capitalize";
import MenuGroups from "../menuGroups";
import { defaultPostLabels } from "../common";
import ChainTypes from "../../chainTypes";
import dynamic from "next/dynamic";

const ProjectIconDarwinia2Dark = dynamic(() =>
  import("@osn/icons/subsquare").then((mod) => mod.ProjectIconDarwinia2Dark),
);
const ProjectIconDarwinia2Light = dynamic(() =>
  import("@osn/icons/subsquare").then((mod) => mod.ProjectIconDarwinia2Light),
);
const ProjectLogoDarwinia2Dark = dynamic(() =>
  import("@osn/icons/subsquare").then((mod) => mod.ProjectLogoDarwinia2Dark),
);
const ProjectLogoDarwinia2Light = dynamic(() =>
  import("@osn/icons/subsquare").then((mod) => mod.ProjectLogoDarwinia2Light),
);
import darwiniaTreasuryTracks from "next-common/utils/consts/settings/darwinia/tracks";
import defaultDarwiniaNodes from "next-common/utils/consts/settings/darwinia/nodes";
import darwiniaLinks from "next-common/utils/consts/settings/darwinia/links";

const darwinia2 = {
  value: Chains.darwinia2,
  name: capitalize(Chains.darwinia2),
  identity: Chains.darwinia2,
  symbol: "RING",
  decimals: 18,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 18,
  snsCoverCid: "QmePHNth5sm1P55WeKWwMeSXnNNw42LyagzTs7NeU5YN9A",
  endpoints: defaultDarwiniaNodes,
  avatar: ProjectIconDarwinia2Light,
  darkAvatar: ProjectIconDarwinia2Dark,
  navLogo: ProjectLogoDarwinia2Light,
  navLogoDark: ProjectLogoDarwinia2Dark,
  links: darwiniaLinks,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  hasSubscan: true,
  subscanDomain: "darwinia",
  chainType: ChainTypes.ETHEREUM,
  ethereumNetwork: {
    chainId: "0x2e",
    chainName: "Darwinia2",
    rpcUrls: ["https://rpc.darwinia.network"],
    blockExplorerUrls: ["https://darwinia.subscan.io/"],
    nativeCurrency: {
      symbol: "RING",
      decimals: 18,
    },
  },
  description:
    "Darwinia Provides Cross-Chain Smart Contract Platform And Message Port Network.",
  useVoteCall: true,
  modules: {
    referenda: true,
    democracy: true,
  },
  cssVarsLight: {
    theme100: "rgba(219,55,138,0.10)",
    theme300: "rgba(219,55,138,0.40)",
    theme500: "rgba(219,55,138,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(219,55,138,0.10)",
    theme300: "rgba(219,55,138,0.40)",
    theme500: "rgba(219,55,138,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  treasuryProposalTracks: darwiniaTreasuryTracks,
};

export default darwinia2;
