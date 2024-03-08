import isNil from "lodash.isnil";
import { calcVotes } from "next-common/utils/democracy/votes/passed/common";
import { isSameAddress } from "..";
import { u8aToHex } from "@polkadot/util";

let votingForEntries = null;

async function queryEntries(api, startKey, num = 1000) {
  return api.query.convictionVoting.votingFor.entriesPaged({
    args: [],
    pageSize: num,
    startKey,
  });
}

function normalizeVotingForEntry([storageKey, voting]) {
  const account = storageKey.args[0].toString();
  const trackId = storageKey.args[1].toNumber();

  return {
    account,
    trackId,
    voting,
  };
}

async function queryAllDelegatingEntries(api) {
  let startKey = null;
  let result = [];
  let entries = await queryEntries(api, startKey, 1000);
  while (entries.length > 0) {
    const normalizedVotes = entries.map((item) =>
      normalizeVotingForEntry(item),
    );
    const delegatingVotes = normalizedVotes.filter(
      ({ voting }) => voting.isDelegating,
    );
    result.push(...delegatingVotes);

    startKey = u8aToHex(entries[entries.length - 1][0]);
    entries = await queryEntries(api, startKey, 1000);
  }

  return result;
}

export async function getGov2BeenDelegatedListByAddress(api, address, trackId) {
  if (!votingForEntries) {
    votingForEntries = await queryAllDelegatingEntries(api);
  }

  const beenDelegated = [];
  for (const {
    account: delegator,
    trackId: _trackId,
    voting: votingFor,
  } of votingForEntries) {
    if (!isNil(trackId)) {
      if (_trackId !== trackId) {
        continue;
      }
    }

    const voting = votingFor.asDelegating.toJSON();
    if (!isSameAddress(voting.target, address)) {
      continue;
    }
    const votes = calcVotes(
      voting.balance,
      votingFor.asDelegating.conviction.toNumber(),
    );

    beenDelegated.push({ delegator, trackId: _trackId, ...voting, votes });
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
