const { calcMultisigAddress } = require("../../utils/call");
const { extractExtrinsicEvents, isExtrinsicSuccess } = require("../../utils");
const {
  Modules,
  MultisigMethods,
  ProxyMethods,
  UtilityMethods,
} = require("../../utils/constants");
const { GenericCall } = require("@polkadot/types");
const { handleTipCall } = require("../extrinsic/tip");

async function handleCall(call, author, extrinsicIndexer) {
  await handleTipCall(call, author, extrinsicIndexer);
}

async function unwrapProxy(call, signer, extrinsicIndexer) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, extrinsicIndexer);
}

async function handleMultisig(call, signer, extrinsicIndexer) {
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    call.registry.chainSS58
  );

  const innerCall = new GenericCall(call.registry, callHex);
  await handleWrappedCall(innerCall, multisigAddr, extrinsicIndexer);
}

async function unwrapBatch(call, signer, extrinsicIndexer) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(innerCall, signer, extrinsicIndexer);
  }
}

async function handleWrappedCall(call, signer, extrinsicIndexer) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(call, signer, extrinsicIndexer);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(call, signer, extrinsicIndexer);
  } else if (Modules.Utility === section && UtilityMethods.batch === method) {
    await unwrapBatch(call, signer, extrinsicIndexer);
  }

  await handleCall(call, signer, extrinsicIndexer);
}

async function extractAndHandleCall(extrinsic, events = [], extrinsicIndexer) {
  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(call, signer, extrinsicIndexer);
}

async function handleExtrinsics(extrinsics = [], allEvents = [], blockIndexer) {
  let index = 0;
  for (const extrinsic of extrinsics) {
    const events = extractExtrinsicEvents(allEvents, index);
    if (!isExtrinsicSuccess(events)) {
      continue;
    }

    const extrinsicIndexer = { ...blockIndexer, index: index++ };
    await extractAndHandleCall(extrinsic, events, extrinsicIndexer);
  }
}

module.exports = {
  handleExtrinsics,
};
