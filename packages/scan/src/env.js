const CHAINS = {
  KARURA: "karura",
  KUSAMA: "kusama",
  POLKADOT: "polkadot",
};

let chain = null;

function setChain(targetChain) {
  chain = targetChain;
}

function currentChain() {
  if (chain) {
    return chain;
  }

  const allChains = Object.values(CHAINS);
  if (allChains.includes(process.env.CHAIN)) {
    setChain(process.env.CHAIN);
    return chain;
  } else {
    return CHAINS.KARURA;
  }
}

function isKarura() {
  return CHAINS.KARURA === currentChain();
}

module.exports = {
  currentChain,
  CHAINS,
  isKarura,
  setChain,
};
