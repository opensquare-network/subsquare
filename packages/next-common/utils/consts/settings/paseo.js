import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";
import { defaultPostLabels } from "./common";
import { mergeChainModules } from "./common/modules";

const ProjectIconPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoDark"),
);
const ProjectIconPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconPaseoLight"),
);
const ProjectLogoPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoDark"),
);
const ProjectLogoPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoLight"),
);

const nodes = [
  {
    name: "Amforc",
    url: "wss://paseo.rpc.amforc.com",
  },
  {
    name: "Dwellir",
    url: "wss://paseo-rpc.dwellir.com",
  },
  {
    name: "IBP1",
    url: "wss://rpc.ibp.network/paseo",
  },
  {
    name: "IBP2",
    url: "wss://paseo.dotters.network",
  },
  {
    name: "StakeWorld",
    url: "wss://pas-rpc.stakeworld.io",
  },
];

const links = [
  {
    name: "twitter",
    url: "https://twitter.com/PaseoNetwork",
  },
  {
    name: "github",
    url: "https://github.com/paseo-network/.github",
  },
];

const themeVars = {
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

const paseo = {
  value: Chains.paseo,
  name: capitalize(Chains.paseo),
  identity: Chains.paseo,
  symbol: "PAS",
  decimals: 10,
  blockTime: 6000,
  ss58Format: 42,
  endpoints: nodes,
  avatar: ProjectIconPaseoLight,
  darkAvatar: ProjectIconPaseoDark,
  navLogo: ProjectLogoPaseoLight,
  navLogoDark: ProjectLogoPaseoDark,
  navPreferDark: true,
  links,
  group: MenuGroups.Solochain,
  postLabels: defaultPostLabels,
  description:
    "The new Polkadot testnet replacing Rococo. Paseo is decentralised, stable, and community run.",
  modules: mergeChainModules({
    referenda: true,
    fellowship: false,
    treasury: {
      spends: true,
      childBounties: true,
    },
  }),
  integrations: {
    subscan: true,
  },
  showNewTreasuryProposalButton: true,
  ...themeVars,
};

export default paseo;
