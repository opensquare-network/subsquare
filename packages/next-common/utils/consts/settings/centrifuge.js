import { difference } from "lodash-es";
import dynamic from "next/dynamic";
import capitalize from "../../capitalize";
import Chains from "../chains";
import ChainTypes from "../chainTypes";
import { defaultPostLabels, PostLabel } from "./common";
import MenuGroups from "./menuGroups";
import { mergeChainModules } from "./common/modules";

const ProjectIconCentrifugeDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconCentrifugeDark"),
);
const ProjectIconCentrifugeLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconCentrifugeLight"),
);
const ProjectLogoCentrifugeDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoCentrifugeDark"),
);
const ProjectLogoCentrifugeLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoCentrifugeLight"),
);

const name = Chains.centrifuge;

export const defaultNodes = [
  {
    name: "Centrifuge",
    url: "wss://fullnode.centrifuge.io",
  },
  {
    name: "LuckyFriday",
    url: "wss://rpc-centrifuge.luckyfriday.io",
  },
  {
    name: "OnFinality",
    url: "wss://centrifuge-parachain.api.onfinality.io/public-ws",
  },
  {
    name: "Dwellir",
    url: "wss://centrifuge-rpc.dwellir.com",
  },
];

// centrifuge network social links
const links = [
  {
    name: "website",
    url: "https://centrifuge.io/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/centrifuge",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/yEzyUq5gxF",
  },
  {
    name: "github",
    url: "https://github.com/centrifuge/",
  },
];

const ethereumNetwork = {
  chainId: "0x7ef",
  chainName: "Centrifuge",
  rpcUrls: ["https://fullnode.parachain.centrifuge.io/"],
  blockExplorerUrls: ["https://centrifuge.subscan.io/"],
  nativeCurrency: {
    symbol: "CFG",
    decimals: 18,
  },
};

const centrifuge = {
  value: name,
  name: capitalize(name),
  identity: name,
  symbol: "CFG",
  decimals: 18,
  blockTime: 12000,
  hasElections: true,
  ss58Format: 36,
  endpoints: defaultNodes,
  avatar: ProjectIconCentrifugeLight,
  darkAvatar: ProjectIconCentrifugeDark,
  navLogo: ProjectLogoCentrifugeLight,
  navLogoDark: ProjectLogoCentrifugeDark,
  links,
  hasDiscussionsForumTopics: true,
  discourseForumLink: "https://gov.centrifuge.io",
  group: MenuGroups.PolkadotAndParachains,
  postLabels: difference(defaultPostLabels, [PostLabel.TechComm]),
  hasSubscan: true,
  hasDiscussions: false,
  hasTechComm: false,
  description: "Real-world DeFi: The on-chain ecosystem for structured credit.",
  useVoteCall: true,
  hasDotreasury: true,
  hasMultisig: true,
  multisigApiPrefix: "cfg",
  modules: mergeChainModules({
    treasury: {
      bounties: false,
      tips: false,
    },
  }),
  cssVarsLight: {
    theme100: "rgba(18,83,255,0.10)",
    theme300: "rgba(18,83,255,0.40)",
    theme500: "rgba(18,83,255,1)",
    navigationBg: "rgba(255,255,255,1)",
    navigationActive: "rgba(246,247,250,1)",
    navigationBorder: "rgba(235,238,244,1)",
  },
  cssVarsDark: {
    theme100: "rgba(18,83,255,0.10)",
    theme300: "rgba(18,83,255,0.40)",
    theme500: "rgba(18,83,255,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  chainType: ChainTypes.MIXED,
  ethereumNetwork,
};

export default centrifuge;
