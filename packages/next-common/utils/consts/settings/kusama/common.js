import dynamic from "next/dynamic";
const ProjectLogoKusamaDark = dynamic(() =>
  import("@osn/icons/subsquare/ProjectLogoKusamaDark"),
);

const kusamaCommonCfg = {
  identity: "kusama",
  symbol: "KSM",
  decimals: 12,
  ss58Format: 2,
  navLogo: ProjectLogoKusamaDark,
  navLogoDark: ProjectLogoKusamaDark,
  cssVarsLight: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(0,0,0,1)",
    navigationActive: "rgba(255,255,255,0.10)",
    navigationBorder: "rgba(255,255,255,0.12)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",
  },
  cssVarsDark: {
    theme100: "rgba(230,0,122,0.10)",
    theme300: "rgba(230,0,122,0.40)",
    theme500: "rgba(230,0,122,1)",
    navigationBg: "rgba(33,36,51,1)",
    navigationActive: "rgba(38,41,56,1)",
    navigationBorder: "var(--neutral300)",
  },
  supportWalletconnect: true,
};

export default kusamaCommonCfg;
