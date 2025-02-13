import Chains from "../chains";
import MenuGroups from "./menuGroups";
import { defaultPostLabels } from "./common";
import dynamic from "next/dynamic";
import { litentryBlockHeightSettings } from "./blockHeightSettings/litentry";
import { mergeChainModules } from "./common/modules";

const ProjectIconLitentryDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHeimaDark"),
);
const ProjectIconLitentryLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconHeimaLight"),
);
const ProjectLogoLitentryDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoHeima"),
);

const ProjectLogoLitentryLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoHeima"),
);

const DEFAULT_LITENTRY_NODES = [
  {
    name: "Dwellir",
    url: "wss://litentry-rpc.dwellir.com",
  },
  {
    name: "Litentry",
    url: "wss://rpc.litentry-parachain.litentry.io",
  },
  // {
  //   name: "OnFinality",
  //   url: "wss://litentry.api.onfinality.io/public-ws",
  // },
];

const links = [
  {
    name: "website",
    url: "https://www.heima.network/",
  },
  {
    name: "twitter",
    url: "https://twitter.com/litentry",
  },
  {
    name: "medium",
    url: "https://medium.com/litentry",
  },
  {
    name: "telegram",
    url: "https://t.me/litentry",
  },
  {
    name: "discord",
    url: "https://discord.gg/6KxSqDPgWh",
  },
  {
    name: "github",
    url: "https://github.com/litentry",
  },
  {
    name: "youtube",
    url: "https://www.youtube.com/channel/UCbv8QnsNngpV6RMd0Bo2ZBw",
  },
];

const litentry = {
  value: Chains.litentry,
  name: "Heima",
  identity: Chains.polkadot,
  symbol: "HEI",
  decimals: 18,
  blockTime: 12000,
  hasElections: false,
  ss58Format: 31,
  endpoints: DEFAULT_LITENTRY_NODES,
  avatar: ProjectIconLitentryLight,
  darkAvatar: ProjectIconLitentryDark,
  navLogo: ProjectLogoLitentryLight,
  navLogoDark: ProjectLogoLitentryDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  useVoteCall: true,
  hasMultisig: true,
  multisigApiPrefix: "litentry",
  description:
    "Heima Network is a chain abstraction infrastructure designed to enable users to unify all blockchains through a single account.",
  modules: mergeChainModules({
    treasury: {
      tips: false,
      spends: true,
    },
  }),
  integrations: {
    statescan: true,
  },
  cssVarsLight: {
    theme100: "rgba(104,192,102,0.10)",
    theme300: "rgba(104,192,102,0.40)",
    theme500: "rgba(104,192,102,1)",
    navigationBg: "rgba(10,55,59,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.06)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(104,192,102,0.10)",
    theme300: "rgba(104,192,102,0.40)",
    theme500: "rgba(104,192,102,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  blockHeightSettings: litentryBlockHeightSettings,
};

export default litentry;
