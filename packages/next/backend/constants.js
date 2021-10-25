const SupportChains = [
  // "polkadot",
  "kusama",
  "karura",
  "khala",
];

const chainStatusRoom = "CHAIN_STATUS_ROOM";

const SS58Format = Object.freeze({
  Polkadot: 0,
  Kusama: 2,
  Karura: 8,
  Khala: 30,
  Substrate: 42,
});

const ContentType = Object.freeze({
  Markdown: "markdown",
  Html: "html",
});

const PostTitleLengthLimitation = 160;

module.exports = {
  SupportChains,
  SS58Format,
  ContentType,
  PostTitleLengthLimitation,
  chainStatusRoom,
  FEED_INTERVAL: 6000,
};
