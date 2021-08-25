const CHAINS = {
  KARURA: "karura",
};

function currentChain() {
  const allChains = Object.values(CHAINS);

  if (allChains.includes(process.env.CHAIN)) {
    return process.env.CHAIN;
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
};
