const { getApi } = require("../../../api");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../constants");
const { GenericCall } = require("@polkadot/types");
const { blake2AsHex } = require("@polkadot/util-crypto");
const {
  getConstFromRegistry,
  getConstsFromRegistry,
} = require("../../../utils/index");

async function getTipMeta(blockHash, tipHash) {
  const api = await getApi();
  let rawMeta;
  if (api.query.tips) {
    rawMeta = await api.query.tips.tips.at(blockHash, tipHash);
  } else {
    rawMeta = await api.query.treasury.tips.at(blockHash, tipHash);
  }

  let meta = rawMeta.toJSON();
  if (Array.isArray(meta.finder)) {
    const [finder, deposit] = meta.finder;
    meta = {
      ...meta,
      finder,
      deposit,
    };
  }

  return meta;
}

function findNewTipCallFromProxy(registry, proxyCall, reasonHash) {
  const [, , innerCall] = proxyCall.args;
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromMulti(registry, call, reasonHash) {
  const callHex = call.args[3];
  const innerCall = new GenericCall(registry, callHex);
  return getNewTipCall(registry, innerCall, reasonHash);
}

function findNewTipCallFromBatch(registry, call, reasonHash) {
  for (const innerCall of call.args[0]) {
    const call = getNewTipCall(registry, innerCall, reasonHash);
    if (call) {
      return call;
    }
  }

  return null;
}

function getNewTipCall(registry, call, reasonHash) {
  const { section, method, args } = call;
  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    return findNewTipCallFromProxy(registry, call, reasonHash);
  }

  if (Modules.Multisig === section || MultisigMethods.asMulti === method) {
    return findNewTipCallFromMulti(registry, call, reasonHash);
  }

  if (Modules.Utility === section && UtilityMethods.batch === method) {
    return findNewTipCallFromBatch(registry, call, reasonHash);
  }

  if (
    [Modules.Treasury, Modules.Tips].includes(section) &&
    [TipMethods.tipNew, TipMethods.reportAwesome].includes(method)
  ) {
    const hash = blake2AsHex(args[0]);
    if (hash === reasonHash) {
      return call;
    }
  }

  return null;
}

function getTippersCount(registry) {
  const oldModuleValue = getConstFromRegistry(
    registry,
    "ElectionsPhragmen",
    "DesiredMembers"
  );

  if (oldModuleValue) {
    return oldModuleValue.toNumber();
  }

  const newModuleValue = getConstFromRegistry(
    registry,
    "PhragmenElection",
    "DesiredMembers"
  );

  return newModuleValue ? newModuleValue.toNumber() : newModuleValue;
}

function getTipFindersFee(registry) {
  const constants = getConstsFromRegistry(registry, [
    {
      moduleName: "Tips",
      constantName: "TipFindersFee",
    },
    {
      moduleName: "Treasury",
      constantName: "TipFindersFee",
    },
  ]);

  return (constants[0] ?? constants[1])?.toJSON();
}

module.exports = {
  getTipMeta,
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
};
