import {
  normalizeVotingOfEntry,
  objectSpread,
  sortVotesWithConviction,
} from "./common";

function extractDirectVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isDirect)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asDirect.votes.filter(([idx]) =>
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

function addDelegations(mapped, votes = []) {
  const delegations = mapped
    .filter(({ voting }) => voting.isDelegating)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  delegations.forEach(
    ({ account, delegating: { balance, conviction, target } }) => {
      const toDelegator = delegations.find(
        ({ account }) => account === target.toString()
      );
      const to = votes.find(
        ({ account }) =>
          account === (toDelegator ? toDelegator.account : target.toString())
      );

      if (to) {
        votes.push({
          account,
          balance: balance.toBigInt().toString(),
          isDelegating: true,
          aye: to.aye,
          conviction: conviction.toNumber(),
        });
      }
    }
  );

  return votes;
}

export async function getReferendumVotesFromVotingOf(
  blockApi,
  referendumIndex
) {
  const voting = await blockApi.query.democracy.votingOf.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item, blockApi));
  const directVotes = extractDirectVotes(mapped, referendumIndex, blockApi);
  const votesDirectAndDelegating = addDelegations(mapped, directVotes);
  const sorted = sortVotesWithConviction(votesDirectAndDelegating);

  const allAye = sorted.filter((v) => v.aye);
  const allNay = sorted.filter((v) => !v.aye);
  return { allAye, allNay };
}
