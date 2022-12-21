import {
  objectSpread,
  sortVotesWithConviction,
} from "../democracy/votes/passed/common";
import { extractAddressAndTrackId } from "./utils";

function normalizeVotingOfEntry([storageKey, voting], blockApi) {
  const { address, trackId } = extractAddressAndTrackId(storageKey, blockApi);
  return { account: address, trackId, voting };
}

function extractVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isCasting)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asCasting.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex)
        ),
      };
    })
    .filter(({ votes }) => votes.length > 0)
    .map(({ account, votes }) => {
      return {
        account,
        vote: votes[0][1],
      };
    })
    .reduce((result, { account, vote }) => {
      // FIXME We are ignoring split votes
      if (vote.isStandard) {
        const standard = vote.asStandard;
        const balance = standard.balance.toBigInt().toString();

        result.push(
          objectSpread(
            {
              account,
              isDelegating: false,
            },
            {
              balance,
              aye: standard.vote.isAye,
              conviction: standard.vote.conviction.toNumber(),
            }
          )
        );
      }

      return result;
    }, []);
}

function extractDelegations(mapped, track, directVotes = []) {
  const delegations = mapped
    .filter(({ trackId, voting }) => voting.isDelegating && trackId === track)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  const delegationVotes = [];
  delegations.forEach(
    ({ account, delegating: { balance, conviction, target } }) => {
      const to = directVotes.find(
        ({ account }) => account === target.toString()
      );

      if (to) {
        delegationVotes.push({
          account,
          balance: balance.toBigInt().toString(),
          isDelegating: true,
          aye: to.aye,
          conviction: conviction.toNumber(),
        });
      }
    }
  );

  return delegationVotes;
}

export async function getGov2ReferendumVotesFromVotingOf(
  blockApi,
  trackId,
  referendumIndex
) {
  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item, blockApi));

  const directVotes = extractVotes(mapped, referendumIndex, blockApi);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);
  const sorted = sortVotesWithConviction([...directVotes, ...delegationVotes]);

  const allAye = sorted.filter((v) => v.aye);
  const allNay = sorted.filter((v) => !v.aye);
  return { allAye, allNay };
}
