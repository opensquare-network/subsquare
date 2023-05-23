import { normalizeVotingOfEntry, objectSpread, sortVotesWithConviction } from "../common";

function extractDirectVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isDirect)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asDirect.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex),
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
      if (vote.isStandard) {
        const standard = vote.asStandard;
        const balance = standard.balance.toBigInt().toString();

        result.push(
          objectSpread(
            {
              account,
              isDelegating: false,
              isStandard: true,
            },
            {
              balance,
              aye: standard.vote.isAye,
              conviction: standard.vote.conviction.toNumber(),
            },
          ),
        );
      } else if (vote.isSplit) {
        const split = vote.asSplit;
        const ayeBalance = split.aye.toBigInt().toString();
        const nayBalance = split.nay.toBigInt().toString();
        const commonObj = {
          account,
          isDelegating: false,
          isStandard: false,
          isSplit: true,
        };
        if (split.aye.toBigInt() > 0) {
          result.push(objectSpread(
            { ...commonObj },
            {
              balance: ayeBalance,
              aye: true,
              conviction: 0,
            }),
          );
        }
        if (split.nay.toBigInt() > 0) {
          result.push(objectSpread(
            { ...commonObj },
            {
              balance: nayBalance,
              aye: false,
              conviction: 0,
            }),
          );
        }
      }

      return result;
    }, []);
}

function extractDelegations(mapped, directVotes = []) {
  const delegations = mapped
    .filter(({ voting }) => voting.isDelegating)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  return delegations.reduce((result, { account, delegating: { balance, conviction, target } }) => {
    const targetAddress = target.toString();
    const to = directVotes.find(({ account, isStandard }) => account === targetAddress && isStandard);
    if (!to) {
      return result;
    }

    return [
      ...result,
      {
        account,
        target: target.toString(),
        balance: balance.toBigInt().toString(),
        isDelegating: true,
        aye: to.aye,
        conviction: conviction.toNumber(),
      },
    ];
  }, []);
}

// NOTE: #2866, nested detail
function extractDirectVoterDelegations(votes = [], delegationVotes = []) {
    return votes.map((vote) => {
    const directVoterDelegations = delegationVotes.filter((delegationVote) => {
      return delegationVote.target === vote.account;
    });

    vote.directVoterDelegations = sortVotesWithConviction(
      directVoterDelegations,
    );
    return vote;
  });
}

export async function getReferendumVotesFromVotingOf(
  blockApi,
  referendumIndex,
) {
  const voting = await blockApi.query.democracy.votingOf.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item));
  const directVotes = extractDirectVotes(mapped, referendumIndex);
  const delegationVotes = extractDelegations(mapped, directVotes);
  const sorted = sortVotesWithConviction([...directVotes, ...delegationVotes]);

  let allAye = sorted.filter((v) => v.aye);
  let allNay = sorted.filter((v) => !v.aye);

  allAye = extractDirectVoterDelegations(allAye, delegationVotes);
  allNay = extractDirectVoterDelegations(allNay, delegationVotes);

  return { allAye, allNay };
}
