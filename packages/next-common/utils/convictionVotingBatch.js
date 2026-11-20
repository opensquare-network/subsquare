export const DEFAULT_CONVICTION_VOTING_CALLS_PER_TX = 4;

// Leave a little headroom for the utility.batch base weight and other normal
// extrinsics already included in the block.
const SAFETY_RATIO = 0.9;
const MAX_CALLS_PER_TX = 256;

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
 * Keep only the tracks whose current voting state still allows the call.
 *
 * `utility.batch` is atomic: if a partially successful delegate/undelegate is
 * retried with the tracks of the already sent chunks included, the first
 * `AlreadyDelegating` / `NotDelegating` call fails the whole batch again, so the
 * retry could never succeed. Drop the tracks that are already in the requested
 * state before building the next attempt.
 */
export async function filterConvictionVotingTracks(
  api,
  address,
  trackIds,
  predicate,
) {
  if (
    !api?.query?.convictionVoting?.votingFor?.multi ||
    !address ||
    !trackIds?.length
  ) {
    return trackIds;
  }

  try {
    const votingFor = await api.query.convictionVoting.votingFor.multi(
      trackIds.map((trackId) => [address, trackId]),
    );
    return trackIds.filter((trackId, index) => predicate(votingFor[index]));
  } catch {
    return trackIds;
  }
}

/**
 * Keep only the votes that still exist in the account's current voting record.
 *
 * `convictionVoting.removeVote` returns `NotVoter` when the vote is already
 * gone, and `utility.batch` is atomic, so a retry after a partially sent batch
 * must not include the votes that were already removed.
 */
export async function filterExistingVotes(api, address, votes) {
  if (
    !api?.query?.convictionVoting?.votingFor?.multi ||
    !address ||
    !votes?.length
  ) {
    return votes;
  }

  const trackIds = [...new Set(votes.map(({ trackId }) => trackId))];

  try {
    const votingFor = await api.query.convictionVoting.votingFor.multi(
      trackIds.map((trackId) => [address, trackId]),
    );
    const referendumIndexesByTrack = new Map();
    trackIds.forEach((trackId, index) => {
      const voting = votingFor[index];
      const referendumIndexes = new Set();
      if (voting?.isCasting) {
        for (const [referendumIndex] of voting.asCasting.votes) {
          referendumIndexes.add(referendumIndex.toNumber());
        }
      }
      referendumIndexesByTrack.set(trackId, referendumIndexes);
    });

    return votes.filter(({ trackId, referendumIndex }) =>
      referendumIndexesByTrack.get(trackId)?.has(referendumIndex),
    );
  } catch {
    return votes;
  }
}

/**
 * Work out how many convictionVoting calls fit into one extrinsic on this chain.
 *
 * Calls like `delegate` / `undelegate` are heavy on proof size on Asset Hub
 * (about 1.8MB each, while the normal dispatch class allows about 8.4MB per
 * extrinsic), while `removeVote` / `unlock` are much cheaper. A batch that is
 * too large is rejected by the tx pool with
 * "1010: Invalid Transaction: Transaction would exhaust the block limits", so
 * read the chain's own block weight limits and the call's weight instead of
 * hardcoding a single batch size. Pass several sample calls (`sampleCalls`) to
 * size a mixed batch by the heaviest one.
 */
export async function getConvictionVotingCallsPerTx({
  api,
  address,
  sampleCall,
  sampleCalls,
}) {
  const callSamples = sampleCalls ?? (sampleCall ? [sampleCall] : []);
  try {
    const blockWeights = api?.consts?.system?.blockWeights;
    if (!blockWeights || !address || callSamples.length === 0) {
      return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
    }

    const limit = getNormalLimit(blockWeights);
    if (!limit) {
      return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
    }

    const infos = await Promise.all(
      callSamples.map((call) => call.paymentInfo(address)),
    );
    let perCallRefTime = 0n;
    let perCallProofSize = 0n;
    for (const info of infos) {
      const weight = info?.weight?.toJSON?.() ?? info?.weight;
      const refTime = toBigInt(weight?.refTime ?? weight);
      const proofSize = toBigInt(weight?.proofSize);
      if (refTime > perCallRefTime) {
        perCallRefTime = refTime;
      }
      if (proofSize > perCallProofSize) {
        perCallProofSize = proofSize;
      }
    }
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

    const batchSize = Math.floor(
      Math.min(byRefTime, byProofSize) * SAFETY_RATIO,
    );
    if (!Number.isFinite(batchSize) || batchSize < 1) {
      return 1;
    }

    return Math.min(batchSize, MAX_CALLS_PER_TX);
  } catch {
    return DEFAULT_CONVICTION_VOTING_CALLS_PER_TX;
  }
}
