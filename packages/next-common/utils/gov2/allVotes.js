import {
  objectSpread,
  sortVotesWithConviction,
} from "../democracy/votes/passed/common";
import { extractAddressAndTrackId } from "./utils";

function normalizeVotingOfEntry([storageKey, voting], blockApi) {
  const { address, trackId } = extractAddressAndTrackId(storageKey, blockApi);
  return { account: address, trackId, voting };
}

function extractStandardVote(account, vote) {
  const standard = vote.asStandard;
  const balance = standard.balance.toBigInt().toString();

  return [
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
    });
  }
  if (split.nay.toBigInt() > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
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
      },
    ),
  ];
  if (splitAbstain.aye.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: ayeBalance,
        aye: true,
        conviction: 0,
      }),
    );
  }

  if (splitAbstain.nay.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: nayBalance,
        aye: false,
        conviction: 0,
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
          balance: balance.toBigInt().toString(),
          isDelegating: true,
          aye: to.aye,
          conviction: conviction.toNumber(),
        },
      ];
    }, []);
}

export async function getGov2ReferendumVotesFromVotingOf(
  blockApi,
  trackId,
  referendumIndex,
) {
  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingOfEntry(item, blockApi));

  const directVotes = extractVotes(mapped, referendumIndex, blockApi);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);
  const sorted = sortVotesWithConviction([...directVotes, ...delegationVotes]);

  const allAye = sorted.filter((v) => !v.isAbstain && v.aye);
  const allNay = sorted.filter((v) => !v.isAbstain && !v.aye);
  const allAbstain = sorted.filter((v) => v.isAbstain);
  return { allAye, allNay, allAbstain };
}
