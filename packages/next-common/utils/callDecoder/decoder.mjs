import { isNil } from "lodash-es";
import { toTypedCallTree } from "./treeBuilder.mjs";
import { normalizeCallTree } from "./treeNormalize.mjs";
import {
  getDynamicBuilder,
  getLookupCodecBuilder,
  getLookupFn,
} from "@polkadot-api/metadata-builders";
import {
  Bin,
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

function getCallCodecs(metadata) {
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

function getWrappedCallCandidates(bytes) {
  const candidates = [bytes];

  try {
    const unwrappedBytes = decodeExact(Bin(), bytes).asBytes();
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

  for (const candidate of getWrappedCallCandidates(bytes)) {
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
