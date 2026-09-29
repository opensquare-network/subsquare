// Hardcoded demo data for the Payout tab UI review.
// Model follows polkadot-sdk#11603 (treasury ordered payouts):
// per AssetKind: NextPayout { index, order_key, expire_at } + PayoutQueue [(index, order_key)].
// Durations are relative to page load so countdowns stay alive in the demo.

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export { MINUTE, HOUR, DAY };

// OrderExpirationPeriod runtime config: 2 days on Asset Hub.
export const leasePeriodMs = 2 * DAY;

export const payoutQueues = [
  {
    symbol: "USDT",
    assetKind: "ForeignAsset #1984",
    capacity: 100,
    treasuryBalance: 2538420,
    nextPayout: {
      index: 270,
      status: "Pending",
      title:
        "Subscan Enterprise Explorer License - Polkadot 2026 Milestone-Based Service",
      beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
      amount: 20895,
      queueExpiresInMs: 1 * DAY + 4 * HOUR + 23 * MINUTE,
    },
    queue: [
      {
        index: 268,
        title:
          "Subscan Enterprise Explorer License - Polkadot 2026 Milestone-Based Service",
        beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
        amount: 20895,
      },
      {
        index: 269,
        title:
          "Subscan Enterprise Explorer License - Polkadot 2026 Milestone-Based Service",
        beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
        amount: 20895,
      },
      {
        index: 237,
        title:
          "OpenSquare products maintenance and development funding for 2026",
        beneficiary: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
        amount: 18000,
      },
      {
        index: 238,
        title:
          "OpenSquare products maintenance and development funding for 2026",
        beneficiary: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
        amount: 18000,
      },
      {
        index: 239,
        title:
          "OpenSquare products maintenance and development funding for 2026",
        beneficiary: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
        amount: 18000,
      },
      {
        index: 240,
        title:
          "OpenSquare products maintenance and development funding for 2026",
        beneficiary: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
        amount: 18000,
      },
      {
        index: 255,
        title:
          "Subscan Enterprise Explorer License - Westend 2026 Milestone-Based Service",
        beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
        amount: 2937,
      },
      {
        index: 256,
        title:
          "Subscan Enterprise Explorer License - Westend 2026 Milestone-Based Service",
        beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
        amount: 2937,
      },
      {
        index: 257,
        title:
          "Subscan Enterprise Explorer License - Westend 2026 Milestone-Based Service",
        beneficiary: "14RYaXRSqb9rPqMaAVp1UZW2czQ6dMNGMbvukwfifi6m8ZgZ",
        amount: 2937,
      },
      {
        index: 263,
        title: "Polkadot Africa - Developer education program Q4 2026",
        beneficiary: "16MLAothZi5pE1ZcZZnBfAVer8h6CXTENnomThFuzi1pqPRa",
        amount: 6500,
      },
      {
        index: 265,
        title: "Substrate Builders Program - Infrastructure support for 2026",
        beneficiary: "15DqZ2p9xAZGjkCgcUoEuByL7mVgLnC8SaAQUccYgE9kKZvK",
        amount: 12400,
      },
    ],
  },
  {
    symbol: "USDC",
    assetKind: "ForeignAsset #1337",
    capacity: 100,
    treasuryBalance: 1204750,
    nextPayout: {
      index: 271,
      status: "Failed",
      title:
        "Referendum #1913 - Continued Integration & Maintenance of Polkadot Asset Hub in the Chainflip Protocol",
      beneficiary: "15DqZ2p9xAZGjkCgcUoEuByL7mVgLnC8SaAQUccYgE9kKZvK",
      amount: 116667,
      queueExpiresInMs: 6 * HOUR + 12 * MINUTE,
    },
    queue: [
      {
        index: 243,
        title: "Snowbridge 2026/2027 Maintenance Proposal",
        beneficiary: "12aoZXwbUzsv3z5HF5HCrtEwBJYCeKne6rYsxFEKDZ86Wdv8",
        amount: 182100,
      },
      {
        index: 272,
        title:
          "[Medium Spender] Referendum #1913 - Continued Integration & Maintenance of Polkadot Asset Hub in the Chainflip Protocol",
        beneficiary: "15DqZ2p9xAZGjkCgcUoEuByL7mVgLnC8SaAQUccYgE9kKZvK",
        amount: 103100,
      },
      {
        index: 273,
        title:
          "[Medium Spender] Referendum #1913 - Continued Integration & Maintenance of Polkadot Asset Hub in the Chainflip Protocol",
        beneficiary: "15DqZ2p9xAZGjkCgcUoEuByL7mVgLnC8SaAQUccYgE9kKZvK",
        amount: 156010,
      },
      {
        index: 277,
        title:
          "ParaSpell✨ XCM Tools - 12 Months of Maintenance and Server cost coverage",
        beneficiary: "16MLAothZi5pE1ZcZZnBfAVer8h6CXTENnomThFuzi1pqPRa",
        amount: 4800,
      },
      {
        index: 280,
        title:
          "ParaSpell✨ XCM Tools - 12 Months of Maintenance and Server cost coverage",
        beneficiary: "16MLAothZi5pE1ZcZZnBfAVer8h6CXTENnomThFuzi1pqPRa",
        amount: 4800,
      },
    ],
  },
  {
    symbol: "DOT",
    assetKind: "Native",
    capacity: 100,
    treasuryBalance: 1876300,
    nextPayout: {
      index: 242,
      status: "Attempted",
      title: "Parachain infrastructure indexing service Q3 2026",
      beneficiary: "15DqZ2p9xAZGjkCgcUoEuByL7mVgLnC8SaAQUccYgE9kKZvK",
      amount: 12000,
      queueExpiresInMs: 4 * DAY + 4 * HOUR,
      maturesInMs: 2 * DAY + 4 * HOUR,
    },
    queue: [
      {
        index: 288,
        title: "Rococo/Westend testnet infrastructure maintenance - Q3 2026",
        beneficiary: "16MLAothZi5pE1ZcZZnBfAVer8h6CXTENnomThFuzi1pqPRa",
        amount: 4500,
      },
      {
        index: 291,
        title: "Validator onboarding workshops 2026",
        beneficiary: "12sNU8BXivMj1xQmcd4T39ugCyHjmhir8jkPqfAw5ZDESrx4",
        amount: 3200,
      },
      {
        index: 295,
        title: "Open-source Polkadot SDK tooling grant",
        beneficiary: "12aoZXwbUzsv3z5HF5HCrtEwBJYCeKne6rYsxFEKDZ86Wdv8",
        amount: 7500,
      },
    ],
  },
];
