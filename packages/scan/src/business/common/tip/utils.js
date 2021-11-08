const { findBlockApi } = require("../../../chain/specs");
const {
  Modules,
  ProxyMethods,
  MultisigMethods,
  UtilityMethods,
  TipMethods,
} = require("../constants");
const { GenericCall } = require("@polkadot/types");
const { blake2AsHex } = require("@polkadot/util-crypto");
const { isKarura } = require("../../../env");

async function getTipMetaFromStorage(api, tipHash, indexer) {
  const blockApi = await findBlockApi(indexer);

  let raw;
  if (blockApi.query.treasury?.tips) {
    raw = await blockApi.query.treasury.tips(tipHash);
  } else {
    raw = await blockApi.query.tips.tips(tipHash);
  }

  return raw.toJSON();
}

async function getTipReason(reasonHash, indexer) {
  const blockApi = await findBlockApi(indexer);

  let raw;
  if (blockApi.query.treasury?.reasons) {
    raw = await blockApi.query.treasury.reasons(reasonHash);
  } else if (blockApi.query.tips?.reasons) {
    raw = await blockApi.query.tips.reasons(reasonHash);
  } else {
    return null;
  }

  return raw.toHuman();
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

async function getTippersCountOfKarura(indexer) {
  const blockApi = await findBlockApi(indexer);
  const members = await blockApi.query.generalCouncil.members();

  return members.length;
}

async function getTippersCount(indexer) {
  if (isKarura()) {
    return await getTippersCountOfKarura(indexer);
  }

  const blockApi = await findBlockApi(indexer);
  if (blockApi.consts.electionsPhragmen?.desiredMembers) {
    return blockApi.consts.electionsPhragmen?.desiredMembers.toNumber();
  } else if (blockApi.consts.phragmenElection?.desiredMembers) {
    return blockApi.consts.phragmenElection?.desiredMembers.toNumber();
  }

  throw new Error("can not get elections desired members");
}

async function getTipFindersFee(indexer) {
  const blockApi = await findBlockApi(indexer);
  if (blockApi.consts.tips?.tipFindersFee) {
    return blockApi.consts.tips?.tipFindersFee.toNumber();
  } else if (blockApi.consts.treasury?.tipFindersFee) {
    return blockApi.consts.treasury?.tipFindersFee.toNumber();
  }

  return null;
}

module.exports = {
  getNewTipCall,
  getTippersCount,
  getTipFindersFee,
  getTipMetaFromStorage,
  getTipReason,
};
