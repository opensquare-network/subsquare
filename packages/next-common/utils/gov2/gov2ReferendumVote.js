import isNil from "lodash.isnil";
import { extractAddressAndTrackId } from "./utils";

export async function getGov2TrackDelegation(api, trackId, address) {
  const voting = await api.query.convictionVoting.votingFor(address, trackId);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  return jsonVoting?.delegating;
}

let votingForEntries = null;

export async function getGov2BeenDelegatedListByAddress(api, address, trackId) {
  if (!votingForEntries) {
    votingForEntries = await api.query.convictionVoting.votingFor.entries();
  }

  const beenDelegated = [];
  for (const [storageKey, votingFor] of votingForEntries) {
    const { address: delegator, trackId: _trackId } = extractAddressAndTrackId(storageKey);
    if (!isNil(trackId)) {
      if (_trackId !== trackId) {
        continue;
      }
    }
    if (!votingFor.isDelegating) {
      continue;
    }
    const voting = votingFor.asDelegating.toJSON();
    if (voting.target !== address) {
      continue;
    }

    beenDelegated.push({ delegator, trackId: _trackId, ...voting });
  }

  return beenDelegated;
}

export async function getGov2BeenDelegatedByAddress(api, address, trackId) {
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

export function clearVotingForEntries() {
  votingForEntries = null;
}
