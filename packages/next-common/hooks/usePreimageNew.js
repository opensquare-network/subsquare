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

const preimageResultCache = new Map();

function parseTicket(rawTicket) {
  if (!rawTicket) return undefined;
  return { who: rawTicket[0].toString(), amount: rawTicket[1] };
}

function parseRequestStatus(optStatus) {
  const status = optStatus.unwrapOr(null);
  if (!status) return { status: null };

  if (status.isRequested) {
    const req = status.asRequested;
    // Older versions: asRequested is an option with no structured fields.
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
    // Older versions, asUnrequested is an option.
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
