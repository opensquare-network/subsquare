const SupportChains = [
  "kintsugi",
];

const chainStatusRoom = "CHAIN_STATUS_ROOM";

const SS58Format = Object.freeze({
  Kintsugi: 2092,
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
