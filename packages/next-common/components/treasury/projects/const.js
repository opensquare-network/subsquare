export const colors = [
  "#EB558999",
  "#785DF399",
  "#E47E5299",
  "#4CAF9199",
  "#0F6FFF99",
  "#FF980080",
  "#2196F399",
];

export const CATEGORY_VALUES = {
  WALLET: "wallet",
  MULTISIG_TOOLS: "multisig_tools",
  EXPLORER: "explorer",
  GOVERNANCE_PLATFORM: "governance_platform",
  POLKADOT_CLIENT: "polkadot_client",
};

export const DOUGHNUT_CONFIG_BY_CATEGORY = {
  wallet: {
    stretch: 1,
  },
  multisig_tools: {
    stretch: 1,
  },
  explorer: {
    stretch: 1,
  },
  governance_platform: {
    stretch: 1,
  },
  polkadot_client: {
    stretch: 8,
    padding: 7,
  },
};

export const LABELS = {
  [CATEGORY_VALUES.WALLET]: "Wallets",
  [CATEGORY_VALUES.MULTISIG_TOOLS]: "Multisig Tools",
  [CATEGORY_VALUES.EXPLORER]: "Explorers",
  [CATEGORY_VALUES.GOVERNANCE_PLATFORM]: "Governance Platforms",
  [CATEGORY_VALUES.POLKADOT_CLIENT]: "Polkadot Clients",
};
