import { useAsync } from "react-use";
import { useContextApi } from "next-common/context/api";
import {
  BN,
  BN_ZERO,
  formatNumber,
  isString,
  isU8a,
  u8aToHex,
} from "@polkadot/util";
import { Option } from "@polkadot/types";
import { buildNoBytesResult } from "./usePreimageNewCommon";

const preimageResultCache = new Map();

function parseHashOrBounded(hashOrBounded, api) {
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

function isHashOnlyStorageKey(api) {
  if (!api?.query.preimage?.preimageFor?.creator.meta.type.isMap) {
    return false;
  }
  const { type } = api.registry.lookup.getTypeDef(
    api.query.preimage.preimageFor.creator.meta.type.asMap.key,
  );
  return type === "H256";
}

function parseTicket(rawTicket) {
  if (!rawTicket) return undefined;
  return { who: rawTicket[0].toString(), amount: rawTicket[1] };
}

function parseRequestStatus(optStatus) {
  const status = optStatus.unwrapOr(null);
  if (!status) return { status: null };

  if (status.isRequested) {
    const req = status.asRequested;
    // 旧版 runtime：asRequested 是 Option，无结构化字段
    if (req instanceof Option) {
      return { status, statusName: "requested" };
    }
    return {
      status,
      statusName: "requested",
      count: req.count.toNumber(),
      ticket: parseTicket(req.maybeTicket.unwrapOr(null)),
      proposalLength: req.maybeLen.unwrapOr(BN_ZERO),
    };
  }

  if (status.isUnrequested) {
    const unreq = status.asUnrequested;
    // 旧版 runtime：asUnrequested 是 Option
    if (unreq instanceof Option) {
      return {
        status,
        statusName: "unrequested",
        ticket: parseTicket(unreq.unwrapOr(null)),
      };
    }
    return {
      status,
      statusName: "unrequested",
      ticket: parseTicket(unreq.ticket),
      proposalLength: unreq.len,
    };
  }

  console.error(`Unhandled PalletPreimageRequestStatus type: ${status.type}`);
  return { status };
}

function buildPreimageForKey(proposalHash, proposalLength, hashOnly) {
  if (hashOnly) {
    return [proposalHash];
  }
  return [[proposalHash, proposalLength || BN_ZERO]];
}

function extractCallData(optBytes) {
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

function decodeCallBytes(callData, registry, proposalLength) {
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
      // status 未提供 proposalLength，从解码的 Call 中推导
      resolvedLength = new BN(callLength);
    }
  } catch {
    proposalError = "Unable to decode preimage bytes into a valid Call";
  }

  return { proposal, proposalError, proposalWarning, resolvedLength };
}

function buildBaseResult(proposalHash, hashOnly, registry, inlineData) {
  return {
    proposalHash,
    count: 0,
    isCompleted: false,
    isHashParam: hashOnly,
    registry,
    status: null,
    ticket: undefined,
    statusName: null,
    // 若为 inline data，proposalLength 可从字节长度得出
    proposalLength: inlineData ? new BN(inlineData.length) : null,
    proposal: null,
    proposalError: null,
    proposalWarning: null,
  };
}

function buildCompletedResult(base, decoded) {
  return {
    ...base,
    isCompleted: true,
    proposal: decoded.proposal ?? null,
    proposalError: decoded.proposalError ?? null,
    proposalWarning: decoded.proposalWarning ?? null,
    // 若 decoded 提供了推导出的 length 则使用，否则沿用 base 中的
    proposalLength: decoded.resolvedLength ?? base.proposalLength,
  };
}

function resolveInlinePreimage(proposalHash, hashOnly, api, inlineData) {
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

async function fetchPreimage(proposalHash, api, hashOnly) {
  const base = buildBaseResult(proposalHash, hashOnly, api.registry, null);

  if (!api.query.preimage?.requestStatusFor) return base;

  const optStatus = await api.query.preimage.requestStatusFor(proposalHash);
  const parsedStatus = parseRequestStatus(optStatus);
  const withStatus = { ...base, ...parsedStatus };

  if (!parsedStatus.status) return withStatus;

  if (!api.query.preimage?.preimageFor) return withStatus;

  const bytesKey = buildPreimageForKey(
    proposalHash,
    withStatus.proposalLength,
    hashOnly,
  );
  const optBytes = await api.query.preimage.preimageFor(...bytesKey);
  const callData = extractCallData(optBytes);

  if (!callData) return buildNoBytesResult(withStatus);

  const decoded = decodeCallBytes(
    callData,
    api.registry,
    withStatus.proposalLength,
  );
  return buildCompletedResult(withStatus, decoded);
}

export default function usePreimage(hashOrBounded) {
  const api = useContextApi();

  const { value, loading } = useAsync(async () => {
    if (!hashOrBounded || !api) return null;

    const { proposalHash, inlineData } = parseHashOrBounded(hashOrBounded, api);
    if (!proposalHash) return null;

    if (preimageResultCache.has(proposalHash)) {
      return preimageResultCache.get(proposalHash);
    }

    const hashOnly = isHashOnlyStorageKey(api);

    const result = inlineData
      ? resolveInlinePreimage(proposalHash, hashOnly, api, inlineData)
      : await fetchPreimage(proposalHash, api, hashOnly);

    if (result?.isCompleted) {
      preimageResultCache.set(proposalHash, result);
    }

    return result;
  }, [hashOrBounded, api]);

  const isStatusLoaded = Boolean(api) && !loading;
  const isPreimageLoaded =
    Boolean(api) && !loading && Boolean(value?.isCompleted);

  return [value ?? {}, isStatusLoaded, isPreimageLoaded];
}
