import {
  BN,
  BN_ZERO,
  formatNumber,
  isString,
  isU8a,
  u8aToHex,
} from "@polkadot/util";
import { blake2AsHex } from "@polkadot/util-crypto";
import { decodePreimageWithPapi } from "./useOldPreimageCommon";

export function parsePapiHashOrBounded(hashOrBounded) {
  if (isString(hashOrBounded)) {
    return { proposalHash: hashOrBounded };
  }

  if (isU8a(hashOrBounded)) {
    return { proposalHash: hashOrBounded.toHex() };
  }

  if (hashOrBounded.isInline) {
    const inlineData = hashOrBounded.asInline.toU8a(true);
    const proposalHash = blake2AsHex(inlineData);
    return { proposalHash, inlineData };
  }

  if (hashOrBounded.isLegacy) {
    return { proposalHash: hashOrBounded.asLegacy.hash_.toHex() };
  }

  if (hashOrBounded.isLookup) {
    return { proposalHash: hashOrBounded.asLookup.hash_.toHex() };
  }

  console.error(
    `Unhandled FrameSupportPreimagesBounded type: ${hashOrBounded.type}`,
  );
  return {};
}

export function buildNoBytesResult(base) {
  return {
    ...base,
    isCompleted: true,
    proposal: null,
    proposalError: null,
    proposalWarning: "No preimage bytes found",
    proposalLength: base.proposalLength || BN_ZERO,
  };
}

export function buildBasePapiResult(proposalHash, inlineData) {
  return {
    proposalHash,
    count: 0,
    isCompleted: false,
    isHashParam: false,
    registry: null,
    status: null,
    ticket: undefined,
    deposit: undefined,
    statusName: null,
    proposalLength: inlineData ? new BN(inlineData.length) : null,
    proposal: null,
    proposalError: null,
    proposalWarning: null,
  };
}

export async function resolveInlinePapiPreimage(
  proposalHash,
  inlineData,
  client,
) {
  const base = buildBasePapiResult(proposalHash, inlineData);

  const decoded = await decodePreimageWithPapi(base, inlineData, client);

  if (!decoded) {
    return {
      ...base,
      isCompleted: true,
      proposalError: "Unable to decode preimage bytes into a valid Call",
    };
  }

  return decoded;
}

// ── polkadot-js shared (used by usePreimage + useOldPreimage) ────────────────

// 将任意 hashOrBounded 输入统一为 { proposalHash, inlineData? }
// inline hash 通过 api.registry.hash 计算
export function parseHashOrBounded(hashOrBounded, api) {
  if (isString(hashOrBounded)) {
    return { proposalHash: hashOrBounded };
  }

  if (isU8a(hashOrBounded)) {
    return { proposalHash: hashOrBounded.toHex() };
  }

  if (hashOrBounded.isInline) {
    const inlineData = hashOrBounded.asInline.toU8a(true);
    const proposalHash = u8aToHex(api?.registry.hash(inlineData));
    return { proposalHash, inlineData };
  }

  if (hashOrBounded.isLegacy) {
    return { proposalHash: hashOrBounded.asLegacy.hash_.toHex() };
  }

  if (hashOrBounded.isLookup) {
    return { proposalHash: hashOrBounded.asLookup.hash_.toHex() };
  }

  console.error(
    `Unhandled FrameSupportPreimagesBounded type: ${hashOrBounded.type}`,
  );
  return {};
}

// 判断 preimageFor 存储的 key 类型：H256-only（旧版）还是 (H256, u32)（新版）
export function isHashOnlyStorageKey(api) {
  if (!api?.query.preimage?.preimageFor?.creator.meta.type.isMap) {
    return false;
  }
  const { type } = api.registry.lookup.getTypeDef(
    api.query.preimage.preimageFor.creator.meta.type.asMap.key,
  );
  return type === "H256";
}

export function buildPreimageForKey(proposalHash, proposalLength, hashOnly) {
  if (hashOnly) {
    return [proposalHash];
  }
  return [[proposalHash, proposalLength || BN_ZERO]];
}

export function extractCallData(optBytes) {
  if (!optBytes) return null;

  const callData = isU8a(optBytes)
    ? optBytes
    : optBytes.unwrapOr?.(null) ?? optBytes;

  if (!callData) return null;
  if (isU8a(callData) && callData.length === 0) return null;
  if (isString(callData) && callData === "0x") return null;
  if (typeof callData?.toHex === "function" && callData.toHex() === "0x")
    return null;

  return callData;
}

export function decodeCallBytes(callData, registry, proposalLength) {
  let proposal = null;
  let proposalError = null;
  let proposalWarning = null;
  let resolvedLength;

  try {
    proposal = registry.createType("Call", callData);
    const callLength = proposal.encodedLength;

    if (proposalLength) {
      const storeLength = proposalLength.toNumber();
      if (callLength !== storeLength) {
        proposalWarning = `Decoded call length does not match on-chain stored preimage length (${formatNumber(
          callLength,
        )} bytes vs ${formatNumber(storeLength)} bytes)`;
      }
    } else {
      resolvedLength = new BN(callLength);
    }
  } catch {
    proposalError = "Unable to decode preimage bytes into a valid Call";
  }

  return { proposal, proposalError, proposalWarning, resolvedLength };
}

export function buildBaseResult(proposalHash, hashOnly, registry, inlineData) {
  return {
    proposalHash,
    count: 0,
    isCompleted: false,
    isHashParam: hashOnly,
    registry,
    status: null,
    ticket: undefined,
    deposit: undefined,
    statusName: null,
    proposalLength: inlineData ? new BN(inlineData.length) : null,
    proposal: null,
    proposalError: null,
    proposalWarning: null,
  };
}

export function buildCompletedResult(base, decoded) {
  return {
    ...base,
    isCompleted: true,
    proposal: decoded.proposal ?? null,
    proposalError: decoded.proposalError ?? null,
    proposalWarning: decoded.proposalWarning ?? null,
    proposalLength: decoded.resolvedLength ?? base.proposalLength,
  };
}

export function resolveInlinePreimage(proposalHash, hashOnly, api, inlineData) {
  const base = buildBaseResult(
    proposalHash,
    hashOnly,
    api.registry,
    inlineData,
  );
  const callData = extractCallData(inlineData);
  const decoded = callData
    ? decodeCallBytes(callData, api.registry, base.proposalLength)
    : { proposal: null, proposalError: null, proposalWarning: null };
  return buildCompletedResult(base, decoded);
}
