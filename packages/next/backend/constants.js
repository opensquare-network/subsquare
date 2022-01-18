const SupportChains = [
  // "polkadot",
  "kusama",
  "karura",
  "khala",
  "basilisk",
  "kabocha",
  "bifrost",
  "acala",
];

const chainStatusRoom = "CHAIN_STATUS_ROOM";

const SS58Format = Object.freeze({
  Polkadot: 0,
  Kusama: 2,
  Karura: 8,
  Khala: 30,
  Basilisk: 10041,
  Substrate: 42,
  Kabocha: 2,
  Bifrost: 6,
  Acala: 10,
});

const ContentType = Object.freeze({
  Markdown: "markdown",
  Html: "html",
});

const PostTitleLengthLimitation = 160;

const Day = 24 * 60 * 60 * 1000;

module.exports = {
  SupportChains,
  SS58Format,
  ContentType,
  PostTitleLengthLimitation,
  chainStatusRoom,
  FEED_INTERVAL: 6000,
  Day,
};
