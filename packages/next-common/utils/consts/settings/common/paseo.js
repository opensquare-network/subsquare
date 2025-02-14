import Chains from "../../chains";
import dynamic from "next/dynamic";
import MenuGroups from "../menuGroups";

const ProjectLogoPaseoDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoDark"),
);
const ProjectLogoPaseoLight = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoPaseoLight"),
);

export const links = [
  {
    name: "twitter",
    url: "https://twitter.com/PaseoNetwork",
  },
  {
    name: "github",
    url: "https://github.com/paseo-network/.github",
  },
];

export const themeVars = {
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
export const commonSettings = {
  identity: Chains.paseo,
  symbol: "PAS",
  decimals: 10,
  ss58Format: 0,
  navLogo: ProjectLogoPaseoLight,
  navLogoDark: ProjectLogoPaseoDark,
  group: MenuGroups.Paseo,
};
