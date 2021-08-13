const SupportChains = [
  "polkadot",
  "kusama",
  "karura",
];

const SS58Format = Object.freeze({
  Polkadot: 0,
  Kusama: 2,
  Substrate: 42,
});

module.exports = {
  SupportChains,
  SS58Format,
};
