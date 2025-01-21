import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { name } from "../consts";
import { isSameAddress } from "next-common/utils";

export const allVotesSelector = (state) => state[name].allVotes;
export const showVotesNumberSelector = createSelector(
  allVotesSelector,
  (allVotes) => !!allVotes,
);
export const votesTriggerSelector = (state) => state[name].votesTrigger;

export const allAyeSelector = createSelector(allVotesSelector, (allVotes) =>
  (allVotes || []).filter((v) => v.aye),
);

export const allNaySelector = createSelector(allVotesSelector, (allVotes) =>
  (allVotes || []).filter((v) => !v.aye),
);

export const allDirectVotesSelector = createSelector(
  allVotesSelector,
  (allVotes) => (allVotes || []).filter((v) => !v.isDelegating),
);

export const allDelegationVotesSelector = createSelector(
  allVotesSelector,
  (allVotes) => (allVotes || []).filter((v) => v.isDelegating),
);

export const nestedVotesSelector = createSelector(
  allDirectVotesSelector,
  allDelegationVotesSelector,
  (directVotes, delegations) => {
    const directVotesWithNested = directVotes.map((vote) => {
      if (!vote.isStandard) {
        return {
          ...vote,
          directVoterDelegations: [],
          totalVotes: vote.votes,
          totalDelegatedVotes: 0,
          totalDelegatedCapital: 0,
        };
      }

      const directVoterDelegations = delegations.filter((delegationVote) => {
        return isSameAddress(delegationVote.target, vote.account);
      });
      const allDelegationVotes = directVoterDelegations.reduce((result, d) => {
        return new BigNumber(result).plus(d.votes).toString();
      }, 0);
      const totalVotes = new BigNumber(vote.votes)
        .plus(allDelegationVotes)
        .toString();
      const totalDelegatedVotes = directVoterDelegations.reduce((result, d) => {
        return BigNumber(result).plus(d.votes).toString();
      }, 0);
      const totalDelegatedCapital = directVoterDelegations.reduce(
        (result, d) => {
          return BigNumber(result).plus(d.balance).toString();
        },
        0,
      );

      return {
        ...vote,
        directVoterDelegations,
        totalVotes,
        totalDelegatedVotes,
        totalDelegatedCapital,
      };
    });

    const allAye = directVotesWithNested.filter((v) => v.aye);
    const allNay = directVotesWithNested.filter((v) => v.aye === false);

    return {
      allAye,
      allNay,
    };
  },
);

export const flattenVotesSelector = createSelector(
  allAyeSelector,
  allNaySelector,
  (allAye, allNay) => {
    return {
      allAye,
      allNay,
    };
  },
);
