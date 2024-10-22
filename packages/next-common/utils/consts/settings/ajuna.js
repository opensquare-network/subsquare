import Chains from "../chains";
import capitalize from "../../capitalize";
import MenuGroups from "./menuGroups";
import dynamic from "next/dynamic";
import { defaultPostLabels } from "./common";
import { mergeChainModules } from "./common/modules";

const ProjectIconAjunaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAjunaDark"),
);
const ProjectIconAjunaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectIconAjunaLight"),
);
const ProjectLogoAjunaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAjunaDark"),
);
const ProjectLogoAjunaLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoAjunaLight"),
);

const nodes = [
  {
    name: "AjunaNetwork",
    url: "wss://rpc-para.ajuna.network",
  },
  {
    name: "IBP1",
    url: "wss://ajuna.ibp.network",
  },
  {
    name: "IBP2",
    url: "wss://ajuna.dotters.network",
  },
  {
    name: "OnFinality",
    url: "wss://ajuna.api.onfinality.io/public-ws",
  },
];

const links = [
  {
    name: "website",
    url: "https://ajuna.io/",
  },
  {
    name: "twitter",
    url: "https://x.com/AjunaNetwork",
  },
  {
    name: "discord",
    url: "https://discord.com/invite/ajuna-network",
  },
  {
    name: "telegram",
    url: "https://t.me/ajunacommunity",
  },
  {
    name: "github",
    url: "https://github.com/ajuna-network/",
  },
  {
    name: "medium",
    url: "https://medium.ajuna.io/",
  },
];

const themeVars = {
  cssVarsLight: {
    theme100: "rgba(19,108,182,0.10)",
    theme300: "rgba(19,108,182,0.40)",
    theme500: "rgba(19,108,182,1)",
    navigationBg: "rgba(31,30,30,1)",
    navigationActive: "rgba(255,255,255,0.04)",
    navigationBorder: "rgba(255,255,255,0.06)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(19,108,182,0.10)",
    theme300: "rgba(19,108,182,0.40)",
    theme500: "rgba(19,108,182,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
};

const ajuna = {
  value: Chains.ajuna,
  name: capitalize(Chains.ajuna),
  identity: Chains.ajuna,
  symbol: "AJUN",
  decimals: 12,
  blockTime: 12000,
  ss58Format: 1328,
  endpoints: nodes,
  avatar: ProjectIconAjunaLight,
  darkAvatar: ProjectIconAjunaDark,
  navLogo: ProjectLogoAjunaLight,
  navLogoDark: ProjectLogoAjunaDark,
  navPreferDark: true,
  links,
  group: MenuGroups.PolkadotAndParachains,
  postLabels: defaultPostLabels,
  description: "Creators of the Polkadot Unity SDK.",
  modules: mergeChainModules({
    referenda: false,
    fellowship: false,
    treasury: {
      bounties: false,
      childBounties: false,
      proposals: true,
      spends: true,
    },
    council: true,
    democracy: true,
    technicalCommittee: true,
  }),
  integrations: {
    subscan: true,
  },
  ...themeVars,
};

export default ajuna;
