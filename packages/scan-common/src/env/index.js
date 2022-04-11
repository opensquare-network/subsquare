const useMetaDb = !!process.env.USE_META_DB;
const scanKnownFirst = !!process.env.SCAN_KNOWN_HEIGHTS_FIRST;
const scanStep = parseInt(process.env.SCAN_STEP) || 100;

const CHAINS = {
  ACALA: "acala",
  KARURA: "karura",
  KHALA: "khala",
  KUSAMA: "kusama",
  POLKADOT: "polkadot",
  BASILISK: "basilisk",
  KINTSUGI: "kintsugi",
  INTERLAY: "interlay",
  BIFROST: "bifrost",
  POLKADEX: "polkadex",
  CRUST: "crust",
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
  return [CHAINS.KARURA, CHAINS.ACALA].includes(currentChain());
}

function isPhala() {
  return [CHAINS.KHALA].includes(currentChain());
}

function isUseMetaDb() {
  return useMetaDb;
}

function doScanKnownFirst() {
  return scanKnownFirst;
}

function getScanStep() {
  return scanStep;
}

module.exports = {
  currentChain,
  CHAINS,
  isKarura,
  setChain,
  isUseMetaDb,
  doScanKnownFirst,
  getScanStep,
  isPhala,
};
