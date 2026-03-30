import { useAsync } from "react-use";
import { Binary } from "polkadot-api";
import { useContextPapi } from "next-common/context/papi";
import {
  fetchPapiPreimageBytes,
  decodePreimageWithPapi,
  toPreimageCount,
  toPreimageLength,
  convertPapiDepositTuple,
  getPapiStatusName,
} from "./useOldPreimageCommon";
import {
  parsePapiHashOrBounded,
  buildNoBytesResult,
  buildBasePapiResult,
  resolveInlinePapiPreimage,
} from "./usePreimageNewCommon";

const papiPreimageResultCache = new Map();

function parsePapiRequestStatus(rawStatus) {
  if (!rawStatus) return { status: null };

  const statusName = getPapiStatusName(rawStatus); // Lowercase first letter
  const { type, value = {} } = rawStatus;
  const result = { status: rawStatus, statusName };

  if (type === "Requested") {
    result.count = toPreimageCount(value.count);
    result.ticket = convertPapiDepositTuple(
      value.maybeTicket ?? value.maybe_ticket,
    );
    result.proposalLength = toPreimageLength(value.maybeLen ?? value.maybe_len);
  } else if (type === "Unrequested") {
    result.ticket = convertPapiDepositTuple(value.ticket);
    result.proposalLength = toPreimageLength(value.len);
  } else {
    console.error(`Unhandled PAPI Preimage.RequestStatusFor type: ${type}`);
  }

  return result;
}

async function fetchPapiPreimage(proposalHash, papi, client) {
  const base = buildBasePapiResult(proposalHash, null);

  if (!papi.query?.Preimage?.RequestStatusFor) return base;

  const rawStatus = await papi.query.Preimage.RequestStatusFor.getValue(
    Binary.fromHex(proposalHash),
  );

  const parsedStatus = parsePapiRequestStatus(rawStatus);
  const withStatus = { ...base, ...parsedStatus };

  if (!parsedStatus.status) return withStatus;

  const bytes = await fetchPapiPreimageBytes(
    papi,
    proposalHash,
    withStatus.proposalLength,
  );

  if (!bytes) return buildNoBytesResult(withStatus);

  let decoded;
  try {
    decoded = await decodePreimageWithPapi(withStatus, bytes, client);
  } catch {
    // ignore
  }

  if (!decoded) {
    return {
      ...withStatus,
      isCompleted: true,
      proposalError: "Unable to decode preimage bytes into a valid Call",
    };
  }

  return decoded;
}

export default function usePreimagePapi(hashOrBounded) {
  const { api: papi, client } = useContextPapi();

  const { value, loading } = useAsync(async () => {
    if (!hashOrBounded || !papi || !client) return null;

    const { proposalHash, inlineData } = parsePapiHashOrBounded(hashOrBounded);
    if (!proposalHash) return null;

    if (papiPreimageResultCache.has(proposalHash)) {
      return papiPreimageResultCache.get(proposalHash);
    }

    const result = inlineData
      ? await resolveInlinePapiPreimage(proposalHash, inlineData, client)
      : await fetchPapiPreimage(proposalHash, papi, client);

    if (result?.isCompleted) {
      papiPreimageResultCache.set(proposalHash, result);
    }

    return result;
  }, [hashOrBounded, papi, client]);

  const isStatusLoaded = Boolean(papi) && Boolean(client) && !loading;
  const isPreimageLoaded =
    Boolean(papi) && Boolean(client) && !loading && Boolean(value?.isCompleted);

  return [value ?? {}, isStatusLoaded, isPreimageLoaded];
}
