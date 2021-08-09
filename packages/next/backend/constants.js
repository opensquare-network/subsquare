const SupportChains = [
  "polkadot",
  "kusama",
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
