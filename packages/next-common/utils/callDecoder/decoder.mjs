import { isNil } from "lodash-es";
import { toTypedCallTree } from "./treeBuilder.mjs";
import { normalizeCallTree } from "./treeNormalize.mjs";
import { isPrintableTextPayload } from "./payloadText.mjs";
import {
  getDynamicBuilder,
  getLookupCodecBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders";
import {
  Binary,
  metadata as metadataCodec,
  unifyMetadata,
} from "@polkadot-api/substrate-bindings";

export async function getMetadata(client) {
  const metadataRaw = await client._request("state_getMetadata", []);
  return unifyMetadata(metadataCodec.dec(metadataRaw));
}

export async function getBlockMetadata(client, blockHash) {
  const metadataRaw = await client._request("state_getMetadata", [blockHash]);
  return unifyMetadata(metadataCodec.dec(metadataRaw));
}

function isSameBytes(left, right) {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

// Building the codecs of the whole call enum is expensive, and the same
// metadata object is shared by every call decoded from it, so the result is
// cached per metadata instance.
const callCodecsCache = new WeakMap();

function buildCallCodecs(metadata) {
  const lookup = getLookupFn(metadata);
  const dynamicBuilder = getDynamicBuilder(lookup);

  const codecType = lookup.call;
  if (!codecType) {
    throw new Error("Can't find call type definition in metadata");
  }

  const callCodec = dynamicBuilder.buildDefinition(codecType);

  const optionLookupId = -1;
  const optionLookup = (id) => {
    if (id === optionLookupId) {
      return {
        id,
        type: "option",
        value: lookup(codecType),
      };
    }

    return lookup(id);
  };

  const optionCallCodec = getLookupCodecBuilder(optionLookup)(optionLookupId);

  return {
    lookup,
    codecType,
    callCodec,
    optionCallCodec,
  };
}

function getCallCodecs(metadata) {
  const cached = callCodecsCache.get(metadata);
  if (cached) {
    return cached;
  }

  const codecs = buildCallCodecs(metadata);
  callCodecsCache.set(metadata, codecs);
  return codecs;
}

// The index of every call a runtime accepts: pallet index -> call indexes.
// Used to reject payloads that can not be a call of this runtime before the
// codecs are fed with them.
const callIndexesCache = new WeakMap();

// Variants are declared with the index they are encoded with, which is not
// their position in the metadata.
function getVariantIndex(variant, position) {
  return isNil(variant.index) ? position : variant.index;
}

function getCallIndexes(metadata, callTypeId) {
  const cached = callIndexesCache.get(metadata);
  if (cached) {
    return cached;
  }

  const indexes = new Map();
  const callVariants = metadata?.lookup?.[callTypeId]?.def;
  if (callVariants?.tag === "variant") {
    callVariants.value.forEach((pallet, position) => {
      const calls = metadata?.lookup?.[pallet.fields?.[0]?.type]?.def;
      if (calls?.tag !== "variant") {
        return;
      }

      indexes.set(
        getVariantIndex(pallet, position),
        new Set(calls.value.map(getVariantIndex)),
      );
    });
  }

  callIndexesCache.set(metadata, indexes);
  return indexes;
}

function hasCallIndex(indexes, bytes, offset) {
  const palletIndex = bytes[offset];
  const callIndex = bytes[offset + 1];
  if (isNil(palletIndex) || isNil(callIndex)) {
    return false;
  }

  return !!indexes.get(palletIndex)?.has(callIndex);
}

function getWrappedCallCandidates(bytes) {
  const candidates = [bytes];

  try {
    const unwrappedBytes = Binary.fromOpaque(bytes);
    if (!isSameBytes(unwrappedBytes, bytes)) {
      candidates.push(unwrappedBytes);
    }
  } catch {
    // The input is not SCALE-encoded Bytes; keep the raw bytes only.
  }

  return candidates;
}

function decodeExact(codec, bytes) {
  const decodedValue = codec.dec(bytes);
  const encodedBytes = codec.enc(decodedValue);

  if (!isSameBytes(encodedBytes, bytes)) {
    throw new Error("Codec decoded only part of the input bytes");
  }

  return decodedValue;
}

function decodeCallData(bytes, metadata) {
  const { callCodec, optionCallCodec, ...rest } = getCallCodecs(metadata);

  const candidates = getWrappedCallCandidates(bytes);

  // Preimages are also used for plain text notes, which are never a call:
  // decoded as one, the codec reads a text byte as a compact length and
  // allocates an array of that size before it fails.
  if (candidates.some(isPrintableTextPayload)) {
    throw new Error("Preimage payload is text, not a call");
  }

  // Decoding bytes that are not a call of this runtime is expensive, and the
  // codecs are only built for the calls of their own runtime. Payloads that
  // can not start with a valid (pallet, call) index pair are skipped without
  // touching them.
  const indexes = getCallIndexes(metadata, rest.codecType);
  const isCall = (candidate, offset) =>
    indexes.size === 0 || hasCallIndex(indexes, candidate, offset);

  for (const candidate of candidates) {
    if (isCall(candidate, 0)) {
      try {
        const decodedCall = decodeExact(callCodec, candidate);

        return {
          ...rest,
          decodedCall,
          callData: candidate,
        };
      } catch {
        // Try the next shape.
      }
    }

    // A wrapped call is an Option<Call>, whose tag byte is 0 or 1.
    if (candidate[0] <= 1 && isCall(candidate, 1)) {
      try {
        const optionCall = decodeExact(optionCallCodec, candidate);
        if (optionCall !== undefined) {
          return {
            ...rest,
            decodedCall: optionCall,
            callData: callCodec.enc(optionCall),
          };
        }
      } catch {
        // Try the next shape.
      }
    }
  }

  throw new Error("Unable to decode bytes into Call or wrapped Call data");
}

function normalizeCallName(name) {
  return String(name || "")
    .replace(/[_\s-]/g, "")
    .toLowerCase();
}

function getDocsArray(value) {
  return Array.isArray(value) && value.length > 0 ? value : null;
}

function getCallDocs(metadata, section, method) {
  const normalizedSection = normalizeCallName(section);
  const normalizedMethod = normalizeCallName(method);

  const pallet = metadata?.pallets?.find(
    ({ name }) => normalizeCallName(name) === normalizedSection,
  );

  const callsType = pallet?.calls?.type;
  if (isNil(callsType)) {
    return null;
  }

  const callsLookup = metadata?.lookup?.[callsType];
  if (callsLookup?.def?.tag !== "variant") {
    return null;
  }

  const callVariant = callsLookup.def.value?.find(
    ({ name }) => normalizeCallName(name) === normalizedMethod,
  );

  return getDocsArray(callVariant?.docs);
}

function attachCallDocs(node, metadata) {
  if (!node || typeof node !== "object") {
    return node;
  }

  if (node.type === "Call" && node.section && node.method) {
    const docs = getCallDocs(metadata, node.section, node.method);
    if (docs) {
      node.docs = docs;
    }
  }

  if (Array.isArray(node.children)) {
    node.children = node.children.map((child) =>
      attachCallDocs(child, metadata),
    );
  }

  return node;
}

export function decodeCallTreeWithInfo(bytes, metadata) {
  const { decodedCall, lookup, codecType, callData } = decodeCallData(
    bytes,
    metadata,
  );

  const tree = toTypedCallTree(
    decodedCall,
    lookup,
    codecType,
    null,
    null,
    metadata,
  );

  return {
    proposal: attachCallDocs(normalizeCallTree(tree), metadata),
    callData,
  };
}

export function decodeCallTree(bytes, metadata) {
  return decodeCallTreeWithInfo(bytes, metadata).proposal;
}
