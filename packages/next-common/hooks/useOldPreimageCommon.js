import { Binary } from "polkadot-api";
import { blake2AsHex } from "@polkadot/util-crypto";
import {
  BN,
  BN_ZERO,
  formatNumber,
  isString,
  isU8a,
  objectSpread,
  u8aToHex,
} from "@polkadot/util";
import {
  decodeCallTree,
  getMetadata,
} from "next-common/utils/callDecoder/decoder.mjs";
import { isNil } from "lodash-es";

const metadataCache = new WeakMap();

async function getPapiMetadata(client) {
  if (!client) {
    return null;
  }

  let metadataPromise = metadataCache.get(client);
  if (!metadataPromise) {
    metadataPromise = getMetadata(client).catch((error) => {
      metadataCache.delete(client);
      throw error;
    });

    metadataCache.set(client, metadataPromise);
  }

  return metadataPromise;
}

function createInlineHash(hashInlineData, inlineData) {
  if (hashInlineData) {
    return hashInlineData(inlineData);
  }

  return blake2AsHex(inlineData);
}

function createPreimageHashResult(hashOrBounded, options = {}) {
  const { hashInlineData, isHashParam = false, registry = null } = options;
  let proposalHash;
  let inlineData;

  if (isString(hashOrBounded)) {
    proposalHash = hashOrBounded;
  } else if (isU8a(hashOrBounded)) {
    proposalHash = hashOrBounded.toHex();
  } else {
    const bounded = hashOrBounded;

    if (bounded.isInline) {
      inlineData = bounded.asInline.toU8a(true);
      proposalHash = createInlineHash(hashInlineData, inlineData);
    } else if (hashOrBounded.isLegacy) {
      proposalHash = hashOrBounded.asLegacy.hash_.toHex();
    } else if (hashOrBounded.isLookup) {
      proposalHash = hashOrBounded.asLookup.hash_.toHex();
    } else {
      console.error(
        `Unhandled FrameSupportPreimagesBounded type ${hashOrBounded.type}`,
      );
    }
  }

  return {
    inlineData,
    paramsStatus: proposalHash && [proposalHash],
    proposalHash,
    resultPreimageHash: proposalHash && {
      count: 0,
      isCompleted: false,
      isHashParam,
      proposalHash,
      proposalLength: inlineData && new BN(inlineData.length),
      registry,
      status: null,
    },
  };
}

function unwrapMaybeValue(value) {
  if (isNil(value)) {
    return null;
  }

  if (value?.type === "Some") {
    return value.value;
  }

  if (value?.type === "None") {
    return null;
  }

  return value;
}

export function toPreimageLength(value) {
  const unwrappedValue = unwrapMaybeValue(value);
  if (isNil(unwrappedValue)) {
    return null;
  }

  if (BN.isBN(unwrappedValue)) {
    return unwrappedValue;
  }

  return new BN(String(unwrappedValue));
}

export function toPreimageCount(value) {
  const unwrappedValue = unwrapMaybeValue(value);
  if (isNil(unwrappedValue)) {
    return undefined;
  }

  return Number(unwrappedValue);
}

export function convertPapiDepositTuple(tuple) {
  const unwrappedTuple = unwrapMaybeValue(tuple);
  if (!unwrappedTuple) {
    return undefined;
  }

  return {
    amount: unwrappedTuple[1],
    who: unwrappedTuple[0].toString(),
  };
}

export function getPapiStatusName(status) {
  if (!status?.type) {
    return null;
  }

  return status.type.charAt(0).toLowerCase() + status.type.slice(1);
}

/**
 * @internal Determine if we are working with current generation (H256,u32)
 * or previous generation H256 params to the preimageFor storage entry
 */
export function getParamType(api) {
  if (
    api?.query.preimage &&
    api?.query.preimage.preimageFor &&
    api?.query.preimage.preimageFor.creator.meta.type.isMap
  ) {
    const { type } = api.registry.lookup.getTypeDef(
      api.query.preimage.preimageFor.creator.meta.type.asMap.key,
    );

    if (type === "H256") {
      return "hash";
    } else if (type === "(H256,u32)") {
      return "hashAndLen";
    }
  }

  return "unknown";
}

/** @internal Unwraps a passed preimage hash into components */
export function getPreimageHash(api, hashOrBounded) {
  return createPreimageHashResult(hashOrBounded, {
    hashInlineData: (inlineData) => u8aToHex(api?.registry.hash(inlineData)),
    isHashParam: getParamType(api) === "hash",
    registry: api?.registry,
  });
}

export function getPapiPreimageHash(hashOrBounded) {
  return createPreimageHashResult(hashOrBounded);
}

/** @internal Creates a final result */
export function createResult(interimResult, optBytes) {
  const callData = getCallData(optBytes);
  if (!callData) {
    return createNoPreimageBytesResult(interimResult);
  }

  let proposal = null;
  let proposalError = null;
  let proposalWarning = null;
  let proposalLength;

  try {
    proposal = interimResult.registry.createType("Call", callData);

    const callLength = proposal.encodedLength;

    if (interimResult.proposalLength) {
      const storeLength = interimResult.proposalLength.toNumber();

      if (callLength !== storeLength) {
        proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(
          callLength,
        )} bytes vs ${formatNumber(storeLength)} bytes)`;
      }
    } else {
      proposalLength = new BN(callLength);
    }
  } catch {
    proposalError = "Unable to decode preimage bytes into a valid Call";
  }

  return objectSpread({}, interimResult, {
    isCompleted: true,
    proposal,
    proposalError,
    proposalLength: proposalLength || interimResult.proposalLength,
    proposalWarning,
  });
}

export function createNoPreimageBytesResult(interimResult) {
  return objectSpread({}, interimResult, {
    isCompleted: true,
    proposal: null,
    proposalError: null,
    proposalLength: interimResult.proposalLength || BN_ZERO,
    proposalWarning: "No preimage bytes found",
  });
}

export function getCallData(optBytes) {
  if (!optBytes) {
    return null;
  }

  const callData = isU8a(optBytes)
    ? optBytes
    : optBytes.unwrapOr?.(null) ?? optBytes;

  if (!callData) {
    return null;
  }

  if (isU8a(callData) && callData.length === 0) {
    return null;
  }

  if (isString(callData) && callData === "0x") {
    return null;
  }

  if (typeof callData?.toHex === "function" && callData.toHex() === "0x") {
    return null;
  }

  return callData;
}

export function createPapiResult(interimResult, proposal, callData) {
  let proposalWarning = null;
  let proposalLength;
  const callLength = callData.length;

  if (interimResult.proposalLength) {
    const storeLength = interimResult.proposalLength.toNumber();

    if (callLength !== storeLength) {
      proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(
        callLength,
      )} bytes vs ${formatNumber(storeLength)} bytes)`;
    }
  } else {
    proposalLength = new BN(callLength);
  }

  return objectSpread({}, interimResult, {
    isCompleted: true,
    proposal,
    proposalError: null,
    proposalLength: proposalLength || interimResult.proposalLength,
    proposalWarning,
  });
}

export function createPapiErrorResult(interimResult, proposalError) {
  return objectSpread({}, interimResult, {
    isCompleted: true,
    proposal: null,
    proposalError,
    proposalLength: interimResult.proposalLength,
    proposalWarning: null,
  });
}

export function createPapiLoadingResult(interimResult) {
  return objectSpread({}, interimResult, {
    isApiLoading: true,
    isCompleted: false,
    proposal: null,
    proposalError: null,
    proposalLength: interimResult.proposalLength,
    proposalWarning: null,
  });
}

export async function decodePreimageWithPapi(interimResult, optBytes, client) {
  const callData = getCallData(optBytes);
  if (!callData || !client) {
    return null;
  }

  const metadata = await getPapiMetadata(client);
  if (!metadata) {
    return null;
  }

  const proposal = decodeCallTree(callData, metadata);

  return createPapiResult(interimResult, proposal, callData);
}

export async function fetchPapiPreimageBytes(
  papi,
  proposalHash,
  proposalLength,
) {
  if (!papi || !proposalHash) {
    return null;
  }

  const hash = Binary.fromHex(proposalHash);
  const keyCandidates = [];

  const resolvedLength = toPreimageLength(proposalLength);
  if (resolvedLength) {
    keyCandidates.push([hash, resolvedLength.toNumber()]);
    keyCandidates.push([hash, BigInt(resolvedLength.toString())]);
  }

  keyCandidates.push(hash);

  for (const key of keyCandidates) {
    try {
      const value = await papi.query.Preimage.PreimageFor.getValue(key);
      if (value) {
        return value.asBytes ? value.asBytes() : value;
      }
    } catch {
      // Try the next key shape.
    }
  }

  return null;
}
