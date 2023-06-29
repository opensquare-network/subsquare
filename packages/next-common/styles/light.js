const light = {
  base: {
    isDark: false,
    textPrimary: "rgba(30,33,52,1)",
    textSecondary: "rgba(80,97,118,1)",
    textTertiary: "rgba(157,169,187,1)",
    textDisabled: "rgba(194,200,212,1)",
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
    pink100: "rgba(232, 31, 102, 0.1)",
    pink500: "#E81F66",
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
    gray200: "var(--neutral300)",
    gray400: "var(--neutral500)",
    gray500: "var(--textSecondary)",
    neutral100: "rgba(255,255,255,1)",
    neutral200: "rgba(246,247,250,1)",
    neutral300: "rgba(235,238,244,1)",
    neutral400: "rgba(224,228,235,1)",
    neutral500: "rgba(194,200,212,1)",
    tooltipBg: "rgba(0,0,0,0.800)",
    theme100: "var(--purple100)",
    theme300: "var(--purple300)",
    theme500: "var(--purple500)",
    navigationBg: "var(--neutral100)",
    navigationActive: "var(--neutral200)",
    navigationBorder: "var(--neutral300)",
    navigationText: "var(--textPrimary)",
    navigationTextTertiary: "var(--textTertiary)",
    navigationIcon: "var(--textSecondary)",
    shadow100:
      "0px 6px 7px rgba(30, 33, 52, 0.02),0px 1.34018px 1.56354px rgba(30, 33, 52, 0.0119221),0px 0.399006px 0.465507px rgba(30, 33, 52, 0.00807786)",
    shadow200:
      "0px 6px 22px rgba(30, 33, 52, 0.11), 0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718), 0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282)",

    // compat
    darkBlue: "var(--textPrimary)",
  },
  chain: {
    altair: {
      theme100: "rgba(255,192,18,0.10)",
      theme300: "rgba(255,192,18,0.40)",
      theme500: "rgba(255,192,18,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    bifrostKusama: {
      theme100: "rgba(84,43,251,0.10)",
      theme300: "rgba(84,43,251,0.40)",
      theme500: "rgba(84,43,251,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    karura: {
      theme100: "rgba(229,15,89,0.10)",
      theme300: "rgba(229,15,89,0.40)",
      theme500: "rgba(229,15,89,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    khala: {
      theme100: "rgba(2,255,255,0.10)",
      theme300: "rgba(2,255,255,0.40)",
      theme500: "rgba(2,255,255,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    kintsugi: {
      theme100: "rgba(247,205,69,0.10)",
      theme300: "rgba(247,205,69,0.40)",
      theme500: "rgba(247,205,69,1)",
      navigationBg: "rgba(4,19,51,1)",
      navigationActive: "rgba(255,255,255,0.06)",
      navigationBorder: "rgba(255,255,255,0.08)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    kusama: {
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
    litmus: {
      theme100: "rgba(104,34,251,0.10)",
      theme300: "rgba(104,34,251,0.40)",
      theme500: "rgba(104,34,251,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    turing: {
      theme100: "rgba(168,44,190,0.10)",
      theme300: "rgba(168,44,190,0.40)",
      theme500: "rgba(168,44,190,1)",
      navigationBg: "rgba(31,31,36,1)",
      navigationActive: "rgba(255,255,255,0.04)",
      navigationBorder: "rgba(255,255,255,0.06)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    acala: {
      theme100: "rgba(100,90,255,0.10)",
      theme300: "rgba(100,90,255,0.40)",
      theme500: "rgba(100,90,255,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    bifrostPolkadot: {
      theme100: "rgba(84,43,251,0.10)",
      theme300: "rgba(84,43,251,0.40)",
      theme500: "rgba(84,43,251,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    centrifuge: {
      theme100: "rgba(18,83,255,0.10)",
      theme300: "rgba(18,83,255,0.40)",
      theme500: "rgba(18,83,255,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    darwinia2: {
      theme100: "rgba(219,55,138,0.10)",
      theme300: "rgba(219,55,138,0.40)",
      theme500: "rgba(219,55,138,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    hydradx: {
      theme100: "rgba(246,41,124,0.10)",
      theme300: "rgba(246,41,124,0.40)",
      theme500: "rgba(246,41,124,1)",
      navigationBg: "rgba(2,6,25,1)",
      navigationActive: "rgba(255,255,255,0.08)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    interlay: {
      theme100: "rgba(7,90,188,0.10)",
      theme300: "rgba(7,90,188,0.40)",
      theme500: "rgba(7,90,188,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    litentry: {
      theme100: "rgba(21,184,135,0.10)",
      theme300: "rgba(21,184,135,0.40)",
      theme500: "rgba(21,184,135,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    phala: {
      theme100: "rgba(205,250,80,0.10)",
      theme300: "rgba(205,250,80,0.40)",
      theme500: "rgba(205,250,80,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    polkadotCollectives: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    polkadot: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    zeitgeist: {
      theme100: "rgba(28,100,242,0.10)",
      theme300: "rgba(28,100,242,0.40)",
      theme500: "rgba(28,100,242,1)",
      navigationBg: "rgba(0,0,0,1)",
      navigationActive: "rgba(255,255,255,0.10)",
      navigationBorder: "rgba(255,255,255,0.12)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    crust: {
      theme100: "rgba(250,140,22,0.10)",
      theme300: "rgba(250,140,22,0.40)",
      theme500: "rgba(250,140,22,1)",
      navigationBg: "rgba(38,38,39,1)",
      navigationActive: "rgba(255,255,255,0.04)",
      navigationBorder: "rgba(255,255,255,0.06)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    rococo: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    westendCollectives: {
      theme100: "rgba(239,72,106,0.10)",
      theme300: "rgba(239,72,106,0.40)",
      theme500: "rgba(239,72,106,1)",
      navigationBg: "rgba(255,255,255,1)",
      navigationActive: "rgba(246,247,250,1)",
      navigationBorder: "rgba(235,238,244,1)",
    },
    moonbeam: {
      theme100: "rgba(230,0,122,0.10)",
      theme300: "rgba(230,0,122,0.40)",
      theme500: "rgba(230,0,122,1)",
      navigationBg: "rgba(13,17,38,1)",
      navigationActive: "rgba(255,255,255,0.06)",
      navigationBorder: "rgba(255,255,255,0.08)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
    moonriver: {
      theme100: "rgba(79,204,198,0.10)",
      theme300: "rgba(79,204,198,0.40)",
      theme500: "rgba(79,204,198,1)",
      navigationBg: "rgba(13,17,38,1)",
      navigationActive: "rgba(255,255,255,0.06)",
      navigationBorder: "rgba(255,255,255,0.08)",
      navigationText: "var(--textPrimaryContrast)",
      navigationTextTertiary: "var(--textTertiaryContrast)",
      navigationIcon: "var(--textSecondaryContrast)",
    },
  },
};

// alias
light.chain.bifrost = light.chain.bifrostKusama;

export default light;
