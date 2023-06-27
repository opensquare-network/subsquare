import { calcVotes, objectSpread, sortVotes } from "../democracy/votes/passed/common";
import { extractAddressAndTrackId } from "./utils";
import BigNumber from "bignumber.js";

function normalizeVotingOfEntry([storageKey, voting]) {
  const { address, trackId } = extractAddressAndTrackId(storageKey);
  return { account: address, trackId, voting };
}

function extractStandardVote(account, vote) {
  const standard = vote.asStandard;
  const balance = standard.balance.toBigInt().toString();
  const conviction = standard.vote.conviction.toNumber();

  return [
    {
      account,
      isDelegating: false,
      isStandard: true,
      balance,
      aye: standard.vote.isAye,
      conviction: standard.vote.conviction.toNumber(),
      votes: calcVotes(balance, conviction),
    },
  ];
}

function extractSplitVote(account, vote) {
  const split = vote.asSplit;
  const ayeBalance = split.aye.toBigInt().toString();
  const nayBalance = split.nay.toBigInt().toString();
  const common = {
    account,
    isDelegating: false,
    isSplit: true,
  };

  const result = [];
  if (split.aye.toBigInt() > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: calcVotes(ayeBalance, 0),
    });
  }
  if (split.nay.toBigInt() > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: calcVotes(nayBalance, 0),
    });
  }

  return result;
}

function extractSplitAbstainVote(account, vote) {
  const splitAbstain = vote.asSplitAbstain;
  const ayeBalance = splitAbstain.aye.toBigInt().toString();
  const nayBalance = splitAbstain.nay.toBigInt().toString();
  const abstainBalance = splitAbstain.abstain.toBigInt().toString();
  const common = {
    account,
    isDelegating: false,
    isSplitAbstain: true,
  };

  const result = [
    objectSpread(
      { ...common }, {
        balance: abstainBalance,
        isAbstain: true,
        conviction: 0,
        votes: calcVotes(abstainBalance, 0),
      },
    ),
  ];
  if (splitAbstain.aye.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: ayeBalance,
        aye: true,
        conviction: 0,
        votes: calcVotes(ayeBalance, 0),
      }),
    );
  }

  if (splitAbstain.nay.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: nayBalance,
        aye: false,
        conviction: 0,
        votes: calcVotes(nayBalance, 0),
      }));
  }

  return result;
}

function extractVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isCasting)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asCasting.votes.filter(([idx]) =>
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
        result.push(...extractStandardVote(account, vote));
      } else if (vote.isSplit) {
        result.push(...extractSplitVote(account, vote));
      } else if (vote.isSplitAbstain) {
        result.push(...extractSplitAbstainVote(account, vote));
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

  return delegations.reduce((result, { account, delegating: { balance, conviction, target } }) => {
      const to = directVotes.find(({ account, isStandard }) => account === target.toString() && isStandard);
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
          votes: calcVotes(balance.toBigInt().toString(), conviction.toNumber()),
        },
      ];
    }, []);
}

function extractDirectVoterDelegations(votes = [], delegationVotes = []) {
  return votes.map((vote) => {
    if (!vote.isStandard) {
      Object.assign(vote, {
        directVoterDelegations: [],
        totalVotes: vote.votes,
        totalDelegatedVotes: 0,
        totalDelegatedCapital: 0,
      });
      return vote;
    }

    let directVoterDelegations = delegationVotes.filter((delegationVote) => {
      return delegationVote.target === vote.account;
    });

    sortVotes(directVoterDelegations);
    const allDelegationVotes = directVoterDelegations.reduce((result, d) => {
      return new BigNumber(result).plus(d.votes).toString();
    }, 0);
    const totalVotes = new BigNumber(vote.votes)
      .plus(allDelegationVotes)
      .toString();
    const totalDelegatedVotes = directVoterDelegations.reduce((result, d) => {
      return BigNumber(result).plus(d.votes).toString();
    }, 0);
    const totalDelegatedCapital = directVoterDelegations.reduce((result, d) => {
      return BigNumber(result).plus(d.balance).toString();
    }, 0);

    Object.assign(vote, {
      directVoterDelegations,
      totalVotes,
      totalDelegatedVotes,
      totalDelegatedCapital,
    });
    return vote;
  });
}

export async function getGov2ReferendumVotesFromVotingOf(
  blockApi,
  trackId,
  referendumIndex,
) {
  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item));

  const directVotes = extractVotes(mapped, referendumIndex, blockApi);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);

  const sorted = sortVotes([...directVotes, ...delegationVotes]);

  let allAye = sorted.filter((v) => v.aye);
  let allNay = sorted.filter((v) => v.aye === false);
  let allAbstain = sorted.filter((v) => v.isAbstain);

  allAye = extractDirectVoterDelegations(allAye, delegationVotes);
  allNay = extractDirectVoterDelegations(allNay, delegationVotes);
  allAbstain = extractDirectVoterDelegations(allAbstain, delegationVotes);

  const allVotes = extractDirectVoterDelegations(directVotes, delegationVotes);

  return { allAye, allNay, allAbstain, allVotes };
}
