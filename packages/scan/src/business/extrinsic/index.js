const { handleCouncilPropose } = require("./council/propose");
const { handleAcceptCurator } = require("./bounty/acceptCurator");
const { handleTechCommPropose } = require("./techComm/propose");
const { handleFastTrack } = require("./democracy/fastTrack");
const { handleExternalPropose } = require("./democracy/external");
const { calcMultisigAddress } = require("../../utils/call");
const { extractExtrinsicEvents, isExtrinsicSuccess } = require("../../utils");
const { GenericCall } = require("@polkadot/types");
const { handleTipCall } = require("../extrinsic/tip");
const {
  chain: {
    specs: { findRegistry },
  },
  business: {
    consts: {
      Modules,
      MultisigMethods,
      ProxyMethods,
      UtilityMethods,
      SudoMethods,
    },
  },
} = require("@subsquare/scan-common");

async function handleCall(call, author, extrinsicIndexer, events) {
  await handleTipCall(call, author, extrinsicIndexer, events);
  await handleExternalPropose(call, author, extrinsicIndexer, events);
  await handleFastTrack(call, author, extrinsicIndexer, events);
  await handleTechCommPropose(...arguments);
  await handleAcceptCurator(...arguments);
  await handleCouncilPropose(...arguments);
}

async function unwrapProxy(call, signer, extrinsicIndexer, events) {
  const real = call.args[0].toJSON();
  const innerCall = call.args[2];
  await handleWrappedCall(innerCall, real, extrinsicIndexer, events);
}

async function handleMultisig(call, signer, extrinsicIndexer, events) {
  const registry = await findRegistry(extrinsicIndexer);
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

async function unwrapBatch(call, signer, extrinsicIndexer, events) {
  // TODO: not handle call after the BatchInterrupted event
  for (const innerCall of call.args[0]) {
    await handleWrappedCall(innerCall, signer, extrinsicIndexer, events);
  }
}

async function unwrapSudo(call, signer, extrinsicIndexer, events) {
  const innerCall = call.args[0];
  await handleWrappedCall(innerCall, signer, extrinsicIndexer, events);
}

async function handleWrappedCall(call, signer, extrinsicIndexer, events) {
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

async function extractAndHandleCall(extrinsic, events = [], extrinsicIndexer) {
  const signer = extrinsic.signer.toString();
  const call = extrinsic.method;

  await handleWrappedCall(call, signer, extrinsicIndexer, events);
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
