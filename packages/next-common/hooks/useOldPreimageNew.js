import { useAsync } from "react-use";
import { useContextApi } from "next-common/context/api";
import { BN_ZERO } from "@polkadot/util";
import { Option } from "@polkadot/types";
import {
  buildNoBytesResult,
  buildBaseResult,
  buildCompletedResult,
  buildPreimageForKey,
  decodeCallBytes,
  extractCallData,
  isHashOnlyStorageKey,
  parseHashOrBounded,
  resolveInlinePreimage,
} from "./usePreimageNewCommon";

const oldPreimageResultCache = new Map();

function parseDeposit(rawDeposit) {
  if (!rawDeposit) return undefined;
  return { who: rawDeposit[0].toString(), amount: rawDeposit[1] };
}

function parseStatusFor(optStatus) {
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
      deposit: parseDeposit(req.deposit.unwrapOr(null)),
      proposalLength: req.len.unwrapOr(BN_ZERO),
    };
  }

  if (status.isUnrequested) {
    const unreq = status.asUnrequested;
    // 旧版 runtime：asUnrequested 是 Option
    if (unreq instanceof Option) {
      return {
        status,
        statusName: "unrequested",
        deposit: parseDeposit(unreq.unwrapOr(null)),
      };
    }
    return {
      status,
      statusName: "unrequested",
      deposit: parseDeposit(unreq.deposit),
      proposalLength: unreq.len,
    };
  }

  console.error(`Unhandled PalletPreimageRequestStatus type: ${status.type}`);
  return { status };
}

async function fetchOldPreimage(proposalHash, api, hashOnly) {
  const base = buildBaseResult(proposalHash, hashOnly, api.registry, null);

  if (!api.query.preimage?.statusFor) return base;

  const optStatus = await api.query.preimage.statusFor(proposalHash);
  const parsedStatus = parseStatusFor(optStatus);
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

export default function useOldPreimage(hashOrBounded) {
  const api = useContextApi();

  const { value, loading } = useAsync(async () => {
    if (!hashOrBounded || !api) return null;

    const { proposalHash, inlineData } = parseHashOrBounded(hashOrBounded, api);
    if (!proposalHash) return null;

    if (oldPreimageResultCache.has(proposalHash)) {
      return oldPreimageResultCache.get(proposalHash);
    }

    const hashOnly = isHashOnlyStorageKey(api);

    const result = inlineData
      ? resolveInlinePreimage(proposalHash, hashOnly, api, inlineData)
      : await fetchOldPreimage(proposalHash, api, hashOnly);

    if (result?.isCompleted) {
      oldPreimageResultCache.set(proposalHash, result);
    }

    return result;
  }, [hashOrBounded, api]);

  const isStatusLoaded = Boolean(api) && !loading;
  const isPreimageLoaded =
    Boolean(api) && !loading && Boolean(value?.isCompleted);

  return [value ?? {}, isStatusLoaded, isPreimageLoaded];
}
