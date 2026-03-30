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

const oldPapiPreimageResultCache = new Map();

function parsePapiStatusFor(rawStatus) {
  if (!rawStatus) return { status: null };

  const statusName = getPapiStatusName(rawStatus);
  const { type, value = {} } = rawStatus;
  const result = { status: rawStatus, statusName };

  if (type === "Requested") {
    result.count = toPreimageCount(value.count);
    result.deposit = convertPapiDepositTuple(value.deposit);
    result.proposalLength = toPreimageLength(value.len);
  } else if (type === "Unrequested") {
    result.deposit = convertPapiDepositTuple(value.deposit);
    result.proposalLength = toPreimageLength(value.len);
  } else {
    console.error(`Unhandled PAPI Preimage.StatusFor type: ${type}`);
  }

  return result;
}

async function fetchOldPapiPreimage(proposalHash, papi, client) {
  const base = buildBasePapiResult(proposalHash, null);

  if (!papi.query?.Preimage?.StatusFor) return base;

  const rawStatus = await papi.query.Preimage.StatusFor.getValue(
    Binary.fromHex(proposalHash),
  );

  const parsedStatus = parsePapiStatusFor(rawStatus);
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

export default function useOldPreimagePapi(hashOrBounded) {
  const { api: papi, client } = useContextPapi();

  const { value, loading } = useAsync(async () => {
    if (!hashOrBounded || !papi || !client) return null;

    const { proposalHash, inlineData } = parsePapiHashOrBounded(hashOrBounded);
    if (!proposalHash) return null;

    if (oldPapiPreimageResultCache.has(proposalHash)) {
      return oldPapiPreimageResultCache.get(proposalHash);
    }

    const result = inlineData
      ? await resolveInlinePapiPreimage(proposalHash, inlineData, client)
      : await fetchOldPapiPreimage(proposalHash, papi, client);

    if (result?.isCompleted) {
      oldPapiPreimageResultCache.set(proposalHash, result);
    }

    return result;
  }, [hashOrBounded, papi, client]);

  const isStatusLoaded = Boolean(papi) && Boolean(client) && !loading;
  const isPreimageLoaded =
    Boolean(papi) && Boolean(client) && !loading && Boolean(value?.isCompleted);

  return [value ?? {}, isStatusLoaded, isPreimageLoaded];
}
