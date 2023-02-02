import { Conviction, isAye } from "../referendumCommon";
import { extractAddressAndTrackId } from "./utils";

export async function getGov2TrackDelegation(api, trackId, address) {
  const voting = await api.query.convictionVoting.votingFor(address, trackId);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  return jsonVoting?.delegating;
}

export async function getGov2AddressVote(
  api,
  trackId,
  referendumIndex,
  address
) {
  const voting = await api.query.convictionVoting.votingFor(address, trackId);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  // For the direct vote, just return the vote.
  if (jsonVoting.casting) {
    const vote = (jsonVoting.casting.votes || []).find(
      (vote) => vote[0] === referendumIndex
    )?.[1];

    return {
      ...vote,
      delegations: jsonVoting.casting.delegations,
    };
  }

  // If the address has delegated to other.
  if (jsonVoting.delegating) {
    // Then, look into the votes of the delegating target address.
    const { target, conviction } = jsonVoting.delegating;
    const proxyVoting = await api.query.convictionVoting.votingFor(
      target,
      trackId
    );
    const jsonProxyVoting = proxyVoting?.toJSON();

    const vote = (jsonProxyVoting?.casting?.votes || []).find(
      (vote) => vote[0] === referendumIndex
    )?.[1];

    if (!vote?.standard) {
      return {
        delegating: {
          ...jsonVoting.delegating,
          conviction: Conviction[conviction],
          voted: false,
        },
      };
    }

    // If the delegating target address has standard vote on this referendum,
    // means this address has voted on this referendum.
    const aye = isAye(vote.standard.vote);
    return {
      delegating: {
        ...jsonVoting.delegating,
        conviction: Conviction[conviction],
        voted: true,
        aye,
      },
    };
  }

  return null;
}

let votingForEntries = null;

export async function getGov2BeenDelegatedListByAddress(api, trackId, address) {
  if (!votingForEntries) {
    votingForEntries = await api.query.convictionVoting.votingFor.entries();
  }

  const beenDelegated = [];
  for (const [storageKey, votingFor] of votingForEntries) {
    const { address: delegator, trackId: _trackId } = extractAddressAndTrackId(
      storageKey,
      api
    );
    if (_trackId !== trackId) {
      continue;
    }
    if (!votingFor.isDelegating) {
      continue;
    }
    const voting = votingFor.asDelegating.toJSON();
    if (voting.target !== address) {
      continue;
    }

    beenDelegated.push({ delegator, ...voting });
  }

  return beenDelegated;
}

export async function getGov2BeenDelegatedByAddress(api, trackId, address) {
  const voting = await api.query.convictionVoting.votingFor(address, trackId);

  const jsonVoting = voting.toJSON();
  if (!jsonVoting) {
    return null;
  }

  if (jsonVoting.delegating) {
    return jsonVoting.delegating.delegations;
  }

  if (jsonVoting.casting) {
    return jsonVoting.casting.delegations;
  }

  return null;
}

export async function clearVotingForEntries() {
  votingForEntries = null;
}
