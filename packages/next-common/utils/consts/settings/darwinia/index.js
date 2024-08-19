import dynamic from "next/dynamic";
import darwiniaLinks from "next-common/utils/consts/settings/darwinia/links";
import defaultDarwiniaNodes from "next-common/utils/consts/settings/darwinia/nodes";
import darwiniaTreasuryTracks from "next-common/utils/consts/settings/darwinia/tracks";
import capitalize from "../../../capitalize";
import ChainTypes from "../../chainTypes";
import Chains from "../../chains";
import { defaultPostLabels } from "../common";
import MenuGroups from "../menuGroups";

const ProjectIconDarwinia2Dark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconDarwinia2Dark"),
);
const ProjectIconDarwinia2Light = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconDarwinia2Light"),
);
const ProjectLogoDarwinia2Dark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoDarwinia2Dark"),
);
const ProjectLogoDarwinia2Light = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoDarwinia2Light"),
);

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
  snsCoverSmallCid: "QmSdcMzP5e7x5iZ3FDwVo8LYJjRMeA5N5rrUFrn2SR1rAw",
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
