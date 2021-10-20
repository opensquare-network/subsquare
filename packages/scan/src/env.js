const useMetaDb = !!process.env.USE_META_DB;
const CHAINS = {
  KARURA: "karura",
  KHALA: "khala",
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

function isUseMetaDb() {
  return useMetaDb;
}

module.exports = {
  currentChain,
  CHAINS,
  isKarura,
  setChain,
  isUseMetaDb,
};
