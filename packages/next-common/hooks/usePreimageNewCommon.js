import { BN, BN_ZERO, isString, isU8a } from "@polkadot/util";
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
