import Chains from "../../chains";
import dynamic from "next/dynamic";
import MenuGroups from "../menuGroups";

const ProjectLogoPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoDark"),
);
const ProjectLogoPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoLight"),
);

export const paseoLinks = [
  {
    name: "twitter",
    url: "https://twitter.com/PaseoNetwork",
  },
  {
    name: "github",
    url: "https://github.com/paseo-network/.github",
  },
];

export const paseoThemeVars = {
  cssVarsLight: {
    theme100: "rgba(38,219,141,0.10)",
    theme300: "rgba(38,219,141,0.40)",
    theme500: "rgba(38,219,141,1)",
    navigationBg: "rgba(5,5,6,1)",
    navigationActive: "rgba(255,255,255,0.08)",
    navigationBorder: "rgba(255,255,255,0.10)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(38,219,141,0.10)",
    theme300: "rgba(38,219,141,0.40)",
    theme500: "rgba(38,219,141,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};
export const paseoCommonSettings = {
  identity: Chains.paseo,
  symbol: "PAS",
  decimals: 10,
  ss58Format: 0,
  navLogo: ProjectLogoPaseoLight,
  navLogoDark: ProjectLogoPaseoDark,
  group: MenuGroups.Paseo,
  supportWalletconnect: true,
};

export const paseoRelayChainNodes = [
  {
    name: "Amforc",
    url: "wss://paseo.rpc.amforc.com",
  },
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/paseo",
  },
  {
    name: "StakeWorld",
    url: "wss://pas-rpc.stakeworld.io",
  },
  {
    name: "Dwellir",
    url: "wss://paseo-rpc.n.dwellir.com",
  },
  {
    name: "IBP2",
    url: "wss://paseo.dotters.network",
  },
];

export const paseoAssetHubNodes = [
  {
    name: "IBP1",
    url: "wss://sys.ibp.network/asset-hub-paseo",
  },
  {
    name: "IBP2",
    url: "wss://asset-hub-paseo.dotters.network",
  },
  {
    name: "Dwellir",
    url: "wss://asset-hub-paseo-rpc.n.dwellir.com",
  },
  {
    name: "StakeWorld",
    url: "wss://pas-rpc.stakeworld.io/assethub",
  },
  {
    name: "TurboFlakes",
    url: "wss://sys.turboflakes.io/asset-hub-paseo",
  },
];

export const subscanPaseoAssethubDomain = "assethub-paseo";
export const statescanPaseoAssethubDomain = "assethub-paseo";

export const paseoAssethubMigration = {
  migrated: true,
  timestamp: 1756125576000,
  subscanAssethubDomain: subscanPaseoAssethubDomain,
  statescanAssethubDomain: statescanPaseoAssethubDomain,
  relayBlockTime: 6000,
};
