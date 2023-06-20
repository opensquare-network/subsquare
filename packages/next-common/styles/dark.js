import light from "./light";

const dark = {
  base: {
    ...light.base,

    isDark: true,
    textPrimary: "rgba(255,255,255,1)",
    textSecondary: "rgba(255,255,255,0.500)",
    textTertiary: "rgba(255,255,255,0.200)",
    textDisabled: "rgba(255,255,255,0.150)",
    textPrimaryContrast: "rgba(255,255,255,1)",
    textSecondaryContrast: "rgba(255,255,255,0.600)",
    textTertiaryContrast: "rgba(255,255,255,0.300)",
    textDisabledContrast: "rgba(255,255,255,0.150)",
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
    gray100: "var(--neutral200)",
    gray500: "var(--textSecondary)",
    neutral100: "rgba(33,36,51,1)",
    neutral200: "rgba(38, 41, 56, 1)",
    neutral300: "rgba(39, 42, 58, 1)",
    neutral400: "rgba(54,58,77,1)",
    neutral500: "rgba(87,92,114,1)",
    tooltipBg: "rgba(0,0,0,0.800)",
    theme100: "var(--purple100)",
    theme300: "var(--purple300)",
    theme500: "var(--purple500)",
    navigationBg: "var(--neutral100)",
    navigationActive: "var(--neutral200)",
    navigationBorder: "var(--neutral300)",
    navigationText: "var(--textPrimaryContrast)",
    navigationTextTertiary: "var(--textTertiaryContrast)",
    navigationIcon: "var(--textSecondaryContrast)",

    // compat
    darkBlue: "var(--purple500)",
  },
  chain: {
    altair: {
      theme100: "rgba(255,192,18,0.10)",
      theme300: "rgba(255,192,18,0.40)",
      theme500: "rgba(255,192,18,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    bifrostKusama: {
      theme100: "rgba(84,43,251,0.10)",
      theme300: "rgba(84,43,251,0.40)",
      theme500: "rgba(84,43,251,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    karura: {
      theme100: "rgba(229,15,89,0.10)",
      theme300: "rgba(229,15,89,0.40)",
      theme500: "rgba(229,15,89,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    khala: {
      theme100: "rgba(2,255,255,0.10)",
      theme300: "rgba(2,255,255,0.40)",
      theme500: "rgba(2,255,255,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    kintsugi: {
      theme100: "rgba(247,205,69,0.10)",
      theme300: "rgba(247,205,69,0.40)",
      theme500: "rgba(247,205,69,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    kusama: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    litmus: {
      theme100: "rgba(104,34,251,0.10)",
      theme300: "rgba(104,34,251,0.40)",
      theme500: "rgba(104,34,251,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    turing: {
      theme100: "rgba(168,44,190,0.10)",
      theme300: "rgba(168,44,190,0.40)",
      theme500: "rgba(168,44,190,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    acala: {
      theme100: "rgba(100,90,255,0.10)",
      theme300: "rgba(100,90,255,0.40)",
      theme500: "rgba(100,90,255,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    bifrostPolkadot: {
      theme100: "rgba(84,43,251,0.10)",
      theme300: "rgba(84,43,251,0.40)",
      theme500: "rgba(84,43,251,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    centrifuge: {
      theme100: "rgba(18,83,255,0.10)",
      theme300: "rgba(18,83,255,0.40)",
      theme500: "rgba(18,83,255,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    darwinia2: {
      theme100: "rgba(219,55,138,0.10)",
      theme300: "rgba(219,55,138,0.40)",
      theme500: "rgba(219,55,138,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    hydradx: {
      theme100: "rgba(246,41,124,0.10)",
      theme300: "rgba(246,41,124,0.40)",
      theme500: "rgba(246,41,124,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    interlay: {
      theme100: "rgba(7,90,188,0.10)",
      theme300: "rgba(7,90,188,0.40)",
      theme500: "rgba(7,90,188,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    litentry: {
      theme100: "rgba(21,184,135,0.10)",
      theme300: "rgba(21,184,135,0.40)",
      theme500: "rgba(21,184,135,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    phala: {
      theme100: "rgba(205,250,80,0.10)",
      theme300: "rgba(205,250,80,0.40)",
      theme500: "rgba(205,250,80,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    polkadotCollectives: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    polkadot: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    zeitgeist: {
      theme100: "rgba(28,100,242,0.10)",
      theme300: "rgba(28,100,242,0.40)",
      theme500: "rgba(28,100,242,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    crust: {
      theme100: "rgba(250,140,22,0.10)",
      theme300: "rgba(250,140,22,0.40)",
      theme500: "rgba(250,140,22,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    rococo: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    westendCollectives: {
      theme100: "rgba(239,72,106,0.10)",
      theme300: "rgba(239,72,106,0.40)",
      theme500: "rgba(239,72,106,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    moonbeam: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
    moonriver: {
      theme100: "rgba(79,204,198,0.10)",
      theme300: "rgba(79,204,198,0.40)",
      theme500: "rgba(79,204,198,1)",
      navigationBg: "rgba(33,36,51,1)",
      navigationActive: "rgba(38,41,56,1)",
      navigationBorder: "rgba(39,42,58,1)",
    },
  },
};

// alias
dark.chain.bifrost = dark.chain.bifrostKusama;

export default dark;
