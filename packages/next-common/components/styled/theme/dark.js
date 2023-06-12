import light from "./light";

const dark = {
  ...light,
  isDark: true,

  // text
  textPrimary: "rgba(255,255,255,1)",
  textSecondary: "rgba(255,255,255,0.500)",
  textTertiary: "rgba(255,255,255,0.200)",
  textDisabled: "rgba(255,255,255,0.150)",
  textPrimaryContrast: "rgba(255,255,255,1)",
  textSecondaryContrast: "rgba(255,255,255,0.600)",
  textTertiaryContrast: "rgba(255,255,255,0.300)",
  textDisabledContrast: "rgba(255,255,255,0.150)",
  // color
  purple100: "rgba(104,72,255,0.100)",
  purple300: "rgba(104,72,255,0.400)",
  purple500: "rgba(104,72,255,1)",
  green100: "rgba(76,175,80,0.100)",
  green300: "rgba(76,175,80,0.400)",
  green500: "rgba(76,175,80,1)",
  orange100: "rgba(255,152,0,0.100)",
  orange300: "rgba(255,152,0,0.400)",
  orange500: "rgba(255,152,0,1)",
  red100: "rgba(244,67,54,0.100)",
  red300: "rgba(244,67,54,0.400)",
  red500: "rgba(244,67,54,1)",
  azure100: "rgba(33,150,243,0.100)",
  azure300: "rgba(33,150,243,0.400)",
  azure500: "rgba(33,150,243,1)",
  blue100: "rgba(15,111,255,0.100)",
  blue300: "rgba(15,111,255,0.400)",
  blue500: "rgba(15,111,255,1)",
  sapphire100: "rgba(31,112,199,0.100)",
  sapphire300: "rgba(31,112,199,0.400)",
  sapphire500: "rgba(31,112,199,1)",
  // neutral
  neutral100: "rgba(33,36,51,1)",
  neutral200: "rgba(29,30,44,1)",
  neutral300: "rgba(38,41,56,1)",
  neutral400: "rgba(54,58,77,1)",
  neutral500: "rgba(87,92,114,1)",
  // other
  tooltipBg: "rgba(0,0,0,0.800)",
  // customized
  // kusama
  theme100: "rgba(230,0,122,0.100)",
  theme300: "rgba(230,0,122,0.400)",
  theme500: "rgba(230,0,122,1)",
  navigationBg: "rgba(33,36,51,1)",
  navigationActive: "rgba(39,42,58,1)",
  navigationBorder: "rgba(39,42,58,1)",
  // shadow

  // OLD

  textPlaceholder: "rgba(255, 255, 255, 0.15)",
  textContrast: light.textContrast,
  primaryPurple100: light.primaryPurple100,
  primaryPurple300: light.primaryPurple300,
  primaryPurple500: light.primaryPurple500,
  primaryDarkBlue: "#6848FF",
  secondaryPink100: light.secondaryPink100,
  secondaryPink500: light.secondaryPink500,
  secondaryRed100: light.secondaryRed100,
  secondaryRed500: light.secondaryRed500,
  secondaryYellow100: light.secondaryYellow100,
  secondaryYellow500: light.secondaryYellow500,
  secondaryGreen100: light.secondaryGreen100,
  secondaryGreen300: light.secondaryGreen300,
  secondaryGreen500: light.secondaryGreen500,
  secondaryBlue100: light.secondaryBlue100,
  secondaryBlue500: light.secondaryBlue500,
  secondaryAzure100: light.secondaryAzure100,
  secondaryAzure500: light.secondaryAzure500,
  secondarySapphire100: light.secondarySapphire100,
  secondarySapphire500: light.secondarySapphire500,
  secondaryGray100: light.secondaryGray100,
  secondaryGray500: light.secondaryGray500,
  neutral: "#212433",
  grey100Bg: "#1D1E2C",
  grey200Border: "#272A3A",
  grey300Border: "#363A4D",
  grey400Border: "#575C72",
  shadow100: light.shadow100,
  shadow200: light.shadow200,
};

export default dark;
