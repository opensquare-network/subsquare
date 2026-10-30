export const DEFAULT_CONVICTION_VOTING_CALLS_PER_TX = 4;

// Leave a little headroom for the utility.batch base weight and other normal
// extrinsics already included in the block.
const SAFETY_RATIO = 0.9;
const MAX_CALLS_PER_TX = 64;

function toBigInt(value) {
  if (value === null || value === undefined) {
    return 0n;
  }

  try {
    return BigInt(value.toString());
  } catch {
    return 0n;
  }
}

function getNormalLimit(blockWeights) {
  const normal = blockWeights?.perClass?.normal;
  const limits = [normal?.maxExtrinsic, normal?.maxTotal]
    .map((limit) => limit?.toJSON?.() ?? null)
    .filter(Boolean);
  if (limits.length === 0) {
    return null;
  }

  const refTime = limits
    .map((limit) => toBigInt(limit.refTime))
    .reduce((min, value) => (value < min ? value : min));
  const proofSizes = limits
    .map((limit) => toBigInt(limit.proofSize))
    .filter((value) => value > 0n);
  const proofSize = proofSizes.reduce(
    (min, value) => (value < min ? value : min),
    proofSizes[0] ?? 0n,
  );

  return { refTime, proofSize };
}

/**
 * Work out how many convictionVoting calls fit into one extrinsic on this chain.
 *
 * `convictionVoting.delegate` / `undelegate` are heavy on proof size on Asset
 * Hub (about 1.8MB each, while the normal dispatch class allows about 8.4MB per
 * extrinsic), but much cheaper on other chains (about 170KB on Hydration). A
 * batch that is too large is rejected by the tx pool with
 * "1010: Invalid Transaction: Transaction would exhaust the block limits", so
 * read the chain's own block weight limits and the call's weight instead of
 * hardcoding a single batch size.
 */
export async function getConvictionVotingCallsPerTx({
  api,
  address,
  sampleCall,
}) {
  try {
    const blockWeights = api?.consts?.system?.blockWeights;
    if (!blockWeights || !address || !sampleCall) {
      return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
    }

    const limit = getNormalLimit(blockWeights);
    if (!limit) {
      return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
    }

    const info = await sampleCall.paymentInfo(address);
    const weight = info?.weight?.toJSON?.() ?? info?.weight;
    const perCallRefTime = toBigInt(weight?.refTime ?? weight);
    const perCallProofSize = toBigInt(weight?.proofSize);
    if (perCallRefTime <= 0n) {
      return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
    }

    const byRefTime =
      limit.refTime > 0n
        ? Number(limit.refTime) / Number(perCallRefTime)
        : MAX_CALLS_PER_TX;
    const byProofSize =
      limit.proofSize > 0n && perCallProofSize > 0n
        ? Number(limit.proofSize) / Number(perCallProofSize)
        : MAX_CALLS_PER_TX;

    const calls = Math.floor(Math.min(byRefTime, byProofSize) * SAFETY_RATIO);
    if (!Number.isFinite(calls) || calls < 1) {
      return 1;
    }

    return Math.min(calls, MAX_CALLS_PER_TX);
  } catch {
    return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
  }
}
