import { name } from "../consts";
import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";

export const isLoadingVotesSelector = (state) => state[name].isLoadingVotes;
export const votesTriggerSelector = (state) => state[name].votesTrigger;

export const allAyeSelector = state => {
  const allVotes = state[name].allVotes || [];
  return allVotes.filter((v) => v.aye);
}

export const allNaySelector = state => {
  const allVotes = state[name].allVotes || [];
  return allVotes.filter((v) => v.aye === false);
}

export const allAbstainSelector = state => {
  const allVotes = state[name].allVotes || [];
  return allVotes.filter((v) => v.isAbstain);
}

export const allDirectVotesSelector = state => {
  const allVotes = state[name].allVotes || [];
  return allVotes.filter(v => !v.isDelegating);
}

export const allDelegationVotesSelector = state => {
  const allVotes = state[name].allVotes || [];
  return allVotes.filter(v => v.isDelegating);
}

export const allNestedVotesSelector = createSelector(
  allDirectVotesSelector,
  allDelegationVotesSelector,
  (directVotes, delegations) => {
    const directVotesWithNested = directVotes.map(v => {
      if (!v.isStandard) {
        return {
          ...v,
          directVoterDelegations: [],
          totalVotes: v.votes,
          totalDelegatedVotes: 0,
          totalDelegatedCapital: 0,
        }
      }

      let directVoterDelegations = delegations.filter((delegationVote) => delegationVote.target === v.account);
      const allDelegationVotes = directVoterDelegations.reduce((result, d) => {
        return new BigNumber(result).plus(d.votes).toString();
      }, 0);
      const totalVotes = new BigNumber(v.votes).plus(allDelegationVotes).toString();
      const totalDelegatedVotes = directVoterDelegations.reduce((result, d) => {
        return BigNumber(result).plus(d.votes).toString();
      }, 0);
      const totalDelegatedCapital = directVoterDelegations.reduce((result, d) => {
        return BigNumber(result).plus(d.balance).toString();
      }, 0);

      return {
        ...v,
        directVoterDelegations,
        totalVotes,
        totalDelegatedVotes,
        totalDelegatedCapital,
      }
    });

    const allAye = directVotesWithNested.filter(v => v.aye);
    const allNay = directVotesWithNested.filter(v => v.aye === false);
    const allAbstain = directVotesWithNested.filter(v => v.isAbstain);

    return {
      allAye,
      allNay,
      allAbstain,
    };
  }
)

export const flattenVotesSelector = createSelector(
  allAyeSelector,
  allNaySelector,
  allAbstainSelector,
  (allAye, allNay, allAbstain) => {
    return {
      allAye,
      allNay,
      allAbstain,
    }
  }
)
