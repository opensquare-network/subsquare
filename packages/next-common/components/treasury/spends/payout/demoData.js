// Mock chain data for the payout queue demo provider. Shapes follow what PAPI
// decodes for the pallets in polkadot-sdk#11603, see chainData.js.
// Block numbers are relative to DEMO_HEIGHT (6s block time).

const HERE = { parents: 0, interior: { type: "Here", value: undefined } };
const RELAY_NATIVE = {
  parents: 1,
  interior: { type: "Here", value: undefined },
};

function palletAssetLocation(assetId) {
  return {
    parents: 0,
    interior: {
      type: "X2",
      value: [
        { type: "PalletInstance", value: 50 },
        { type: "GeneralIndex", value: BigInt(assetId) },
      ],
    },
  };
}

const USDT_ASSET_KIND = {
  type: "V5",
  value: { location: HERE, asset_id: palletAssetLocation(1984) },
};

const USDC_ASSET_KIND = {
  type: "V5",
  value: { location: HERE, asset_id: palletAssetLocation(1337) },
};

const DOT_ASSET_KIND = {
  type: "V5",
  value: { location: HERE, asset_id: RELAY_NATIVE },
};

const BENEFICIARY = {
  type: "V5",
  value: {
    location: HERE,
    account_id: {
      parents: 0,
      interior: {
        type: "X1",
        value: {
          type: "AccountId32",
          value: { network: undefined, id: `0x${"00".repeat(32)}` },
        },
      },
    },
  },
};

export const DEMO_HEIGHT = 21_000_000;
export const DEMO_BLOCK_INTERVAL_MS = 1000;

const MINUTE = 10;
const HOUR = 600;
const DAY = 14400;
const PAYOUT_PERIOD = 30 * DAY;
const LOCAL_PAYMENT_ID = (1n << 64n) - 1n;

export const DEMO_MAX_QUEUED_SPENDS = 100;
export const DEMO_ORDER_EXPIRATION_PERIOD = 2 * DAY;

export const DEMO_PALLETS = [
  {
    name: "Treasury",
    storage: {
      items: [
        { name: "NextPayout" },
        { name: "PayoutQueue" },
        { name: "Spends" },
      ],
    },
  },
  { name: "System", storage: { items: [{ name: "Account" }] } },
  { name: "Assets", storage: { items: [{ name: "Account" }] } },
];

function demoTreasurySpend({
  assetKind,
  amount,
  validFrom,
  type = "Pending",
  payoutAt,
}) {
  return {
    asset_kind: assetKind,
    amount,
    beneficiary: BENEFICIARY,
    valid_from: validFrom,
    expire_at: (payoutAt ?? validFrom) + PAYOUT_PERIOD,
    status:
      type === "Attempted"
        ? { type, value: { id: LOCAL_PAYMENT_ID } }
        : { type, value: undefined },
  };
}

export const DEMO_NEXT_PAYOUTS = [
  {
    args: [USDT_ASSET_KIND],
    value: [
      270,
      DEMO_HEIGHT - 11770,
      DEMO_HEIGHT + 1 * DAY + 4 * HOUR + 23 * MINUTE,
    ],
  },
  {
    args: [USDC_ASSET_KIND],
    value: [271, DEMO_HEIGHT - 25080, DEMO_HEIGHT + 6 * HOUR + 12 * MINUTE],
  },
  {
    args: [DOT_ASSET_KIND],
    value: [
      242,
      DEMO_HEIGHT - 1200,
      DEMO_HEIGHT - 1200 + DEMO_ORDER_EXPIRATION_PERIOD,
    ],
  },
];

export const DEMO_PAYOUT_QUEUES = [
  {
    args: [USDT_ASSET_KIND],
    value: [
      [268, DEMO_HEIGHT - 9000],
      [269, DEMO_HEIGHT - 8800],
      [237, DEMO_HEIGHT - 8000],
      [238, DEMO_HEIGHT - 7800],
      [239, DEMO_HEIGHT - 7600],
      [240, DEMO_HEIGHT - 7400],
      [255, DEMO_HEIGHT - 6000],
      [256, DEMO_HEIGHT - 5800],
      [257, DEMO_HEIGHT - 5600],
      [263, DEMO_HEIGHT - 4000],
      [265, DEMO_HEIGHT - 3000],
    ],
  },
  {
    args: [USDC_ASSET_KIND],
    value: [
      [243, DEMO_HEIGHT - 20000],
      [272, DEMO_HEIGHT - 18000],
      [273, DEMO_HEIGHT - 16000],
      [277, DEMO_HEIGHT - 14000],
      [280, DEMO_HEIGHT - 12000],
    ],
  },
  {
    args: [DOT_ASSET_KIND],
    value: [
      [288, DEMO_HEIGHT + 40000],
      [291, DEMO_HEIGHT + 45000],
      [295, DEMO_HEIGHT + 50000],
    ],
  },
];

const SUBSCAN_POLKADOT =
  "Subscan Enterprise Explorer License - Polkadot 2026 Milestone-Based Service";
const OPEN_SQUARE =
  "OpenSquare products maintenance and development funding for 2026";
const SUBSCAN_WESTEND =
  "Subscan Enterprise Explorer License - Westend 2026 Milestone-Based Service";
const CHAINFLIP =
  "Referendum #1913 - Continued Integration & Maintenance of Polkadot Asset Hub in the Chainflip Protocol";
const PARASPELL =
  "ParaSpell✨ XCM Tools - 12 Months of Maintenance and Server cost coverage";

export const DEMO_SPENDS = {
  270: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 20895000000n,
    validFrom: DEMO_HEIGHT - 20000,
  }),
  268: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 20895000000n,
    validFrom: DEMO_HEIGHT - 9000,
  }),
  269: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 20895000000n,
    validFrom: DEMO_HEIGHT - 8800,
  }),
  237: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 18000000000n,
    validFrom: DEMO_HEIGHT - 8000,
  }),
  238: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 18000000000n,
    validFrom: DEMO_HEIGHT - 7800,
  }),
  239: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 18000000000n,
    validFrom: DEMO_HEIGHT - 7600,
  }),
  240: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 18000000000n,
    validFrom: DEMO_HEIGHT - 7400,
  }),
  255: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 2937000000n,
    validFrom: DEMO_HEIGHT - 6000,
  }),
  256: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 2937000000n,
    validFrom: DEMO_HEIGHT - 5800,
  }),
  257: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 2937000000n,
    validFrom: DEMO_HEIGHT - 5600,
  }),
  263: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 6500000000n,
    validFrom: DEMO_HEIGHT - 4000,
  }),
  265: demoTreasurySpend({
    assetKind: USDT_ASSET_KIND,
    amount: 12400000000n,
    validFrom: DEMO_HEIGHT - 3000,
  }),
  271: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 116667000000n,
    validFrom: DEMO_HEIGHT - 30000,
    type: "Failed",
    payoutAt: DEMO_HEIGHT - 18000,
  }),
  243: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 182100000000n,
    validFrom: DEMO_HEIGHT - 20000,
  }),
  272: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 103100000000n,
    validFrom: DEMO_HEIGHT - 18000,
  }),
  273: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 156010000000n,
    validFrom: DEMO_HEIGHT - 16000,
  }),
  277: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 4800000000n,
    validFrom: DEMO_HEIGHT - 14000,
  }),
  280: demoTreasurySpend({
    assetKind: USDC_ASSET_KIND,
    amount: 4800000000n,
    validFrom: DEMO_HEIGHT - 12000,
  }),
  242: demoTreasurySpend({
    assetKind: DOT_ASSET_KIND,
    amount: 120000000000000n,
    validFrom: DEMO_HEIGHT - 2000,
    type: "Attempted",
    payoutAt: DEMO_HEIGHT - 600,
  }),
  288: demoTreasurySpend({
    assetKind: DOT_ASSET_KIND,
    amount: 45000000000000n,
    validFrom: DEMO_HEIGHT + 40000,
  }),
  291: demoTreasurySpend({
    assetKind: DOT_ASSET_KIND,
    amount: 32000000000000n,
    validFrom: DEMO_HEIGHT + 45000,
  }),
  295: demoTreasurySpend({
    assetKind: DOT_ASSET_KIND,
    amount: 75000000000000n,
    validFrom: DEMO_HEIGHT + 50000,
  }),
};

export const DEMO_BALANCES = {
  native: 18763000000000000n,
  1984: 2538420000000n,
  1337: 1204750000000n,
};

export const DEMO_POSTS = {
  270: { index: 270, title: SUBSCAN_POLKADOT },
  268: { index: 268, title: SUBSCAN_POLKADOT },
  269: { index: 269, title: SUBSCAN_POLKADOT },
  237: { index: 237, title: OPEN_SQUARE },
  238: { index: 238, title: OPEN_SQUARE },
  239: { index: 239, title: OPEN_SQUARE },
  240: { index: 240, title: OPEN_SQUARE },
  255: { index: 255, title: SUBSCAN_WESTEND },
  256: { index: 256, title: SUBSCAN_WESTEND },
  257: { index: 257, title: SUBSCAN_WESTEND },
  263: {
    index: 263,
    title: "Polkadot Africa - Developer education program Q4 2026",
  },
  265: {
    index: 265,
    title: "Substrate Builders Program - Infrastructure support for 2026",
  },
  271: { index: 271, title: CHAINFLIP },
  243: { index: 243, title: "Snowbridge 2026/2027 Maintenance Proposal" },
  272: { index: 272, title: `[Medium Spender] ${CHAINFLIP}` },
  273: { index: 273, title: `[Medium Spender] ${CHAINFLIP}` },
  277: { index: 277, title: PARASPELL },
  280: { index: 280, title: PARASPELL },
  242: {
    index: 242,
    title: "Parachain infrastructure indexing service Q3 2026",
  },
  288: {
    index: 288,
    title: "Rococo/Westend testnet infrastructure maintenance - Q3 2026",
  },
  291: { index: 291, title: "Validator onboarding workshops 2026" },
  295: { index: 295, title: "Open-source Polkadot SDK tooling grant" },
};
