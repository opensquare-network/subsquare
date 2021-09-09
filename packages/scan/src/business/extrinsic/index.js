const { handleFastTrack } = require("./democracy/fastTrack");
const { handleExternalPropose } = require("./democracy/external");
const { calcMultisigAddress } = require("../../utils/call");
const { extractExtrinsicEvents, isExtrinsicSuccess } = require("../../utils");
const {
  Modules,
  MultisigMethods,
  ProxyMethods,
  UtilityMethods,
  SudoMethods,
} = require("../common/constants");
const { GenericCall } = require("@polkadot/types");
const { handleTipCall } = require("../extrinsic/tip");

async function handleCall(registry, call, author, extrinsicIndexer, events) {
  await handleTipCall(...arguments);
  await handleExternalPropose(call, author, extrinsicIndexer, events);
  await handleFastTrack(call, author, extrinsicIndexer, events);
}

async function unwrapProxy(registry, call, signer, extrinsicIndexer, events) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(registry, innerCall, real, extrinsicIndexer, events);
}

async function handleMultisig(
  registry,
  call,
  signer,
  extrinsicIndexer,
  events
) {
  const callHex = call.args[3];
  const threshold = call.args[0].toNumber();
  const otherSignatories = call.args[1].toJSON();
  const multisigAddr = calcMultisigAddress(
    [signer, ...otherSignatories],
    threshold,
    registry.chainSS58
  );

  const innerCall = new GenericCall(registry, callHex);
  await handleWrappedCall(registry, innerCall, multisigAddr, extrinsicIndexer);
}

async function unwrapBatch(registry, call, signer, extrinsicIndexer, events) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(
      registry,
      innerCall,
      signer,
      extrinsicIndexer,
      events
    );
  }
}

async function unwrapSudo(registry, call, signer, extrinsicIndexer, events) {
  const innerCall = call.args[0];
  await handleWrappedCall(
    registry,
    innerCall,
    signer,
    extrinsicIndexer,
    events
  );
}

async function handleWrappedCall(
  registry,
  call,
  signer,
  extrinsicIndexer,
  events
) {
  const { section, method } = call;

  if (Modules.Proxy === section && ProxyMethods.proxy === method) {
    await unwrapProxy(...arguments);
  } else if (
    Modules.Multisig === section &&
    MultisigMethods.asMulti === method
  ) {
    await handleMultisig(...arguments);
  } else if (Modules.Utility === section && UtilityMethods.batch === method) {
    await unwrapBatch(...arguments);
  } else if (Modules.Sudo === section && SudoMethods.sudo) {
    await unwrapSudo(...arguments);
  }

  await handleCall(...arguments);
}

async function extractAndHandleCall(
  registry,
  extrinsic,
  events = [],
  extrinsicIndexer
) {
  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(registry, call, signer, extrinsicIndexer, events);
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
