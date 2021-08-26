const { calcMultisigAddress } = require("../../utils/call");
const { extractExtrinsicEvents, isExtrinsicSuccess } = require("../../utils");
const {
  Modules,
  MultisigMethods,
  ProxyMethods,
  UtilityMethods,
} = require("../common/constants");
const { GenericCall } = require("@polkadot/types");
const { handleTipCall } = require("../extrinsic/tip");

async function handleCall(registry, call, author, extrinsicIndexer) {
  await handleTipCall(...arguments);
}

async function unwrapProxy(registry, call, signer, extrinsicIndexer) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, extrinsicIndexer);
}

async function handleMultisig(registry, call, signer, extrinsicIndexer) {
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    registry.chainSS58
  );

  const innerCall = new GenericCall(registry, callHex);
  await handleWrappedCall(innerCall, multisigAddr, extrinsicIndexer);
}

async function unwrapBatch(registry, call, signer, extrinsicIndexer) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(innerCall, signer, extrinsicIndexer);
  }
}

async function handleWrappedCall(registry, call, signer, extrinsicIndexer) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(registry, call, signer, extrinsicIndexer);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(registry, call, signer, extrinsicIndexer);
  } else if (Modules.Utility === section && UtilityMethods.batch === method) {
    await unwrapBatch(registry, call, signer, extrinsicIndexer);
  }

  await handleCall(registry, call, signer, extrinsicIndexer);
}

async function extractAndHandleCall(
  registry,
  extrinsic,
  events = [],
  extrinsicIndexer
) {
  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(registry, call, signer, extrinsicIndexer);
}

async function handleExtrinsics(
  registry,
  extrinsics = [],
  allEvents = [],
  blockIndexer
) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    const extrinsicIndexer = { ...blockIndexer, index: index++ };
    await extractAndHandleCall(registry, extrinsic, events, extrinsicIndexer);
  }
}

module.exports = {
  handleExtrinsics,
};
