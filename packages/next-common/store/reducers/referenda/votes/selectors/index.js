import { name } from "../consts";
import { createSelector } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { flatten } from "lodash-es";
import { isSameAddress } from "next-common/utils";

export const votesTriggerSelector = (state) => state[name].votesTrigger;
export const allVotesSelector = (state) => state[name].allVotes;

export const showVotesNumberSelector = createSelector(
  allVotesSelector,
  (allVotes) => {
    return !!allVotes;
  },
);

export const allAyeSelector = createSelector(allVotesSelector, (allVotes) => {
  return (allVotes || []).filter((v) => v.aye);
});

export const allAyeDelegationVotesSelector = createSelector(
  allAyeSelector,
  (votes) => {
    return votes.filter((v) => v.isDelegating);
  },
);

export const allAyeDirectVotesSelector = createSelector(
  allAyeSelector,
  (votes) => {
    return votes.filter((v) => !v.isDelegating);
  },
);

export const allNaySelector = createSelector(allVotesSelector, (allVotes) => {
  return (allVotes || []).filter((v) => v.aye === false);
});

export const allNayDelegationVotesSelector = createSelector(
  allNaySelector,
  (votes) => {
    return votes.filter((v) => v.isDelegating);
  },
);

export const allNayDirectVotesSelector = createSelector(
  allNaySelector,
  (votes) => {
    return votes.filter((v) => !v.isDelegating);
  },
);

export const allAbstainSelector = createSelector(
  allVotesSelector,
  (allVotes) => {
    return (allVotes || []).filter((v) => v.isAbstain);
  },
);

export const allAbstainDelegationVotesSelector = createSelector(
  allAbstainSelector,
  (votes) => {
    return votes.filter((v) => v.isDelegating);
  },
);

export const allAbstainDirectVotesSelector = createSelector(
  allAbstainSelector,
  (votes) => {
    return votes.filter((v) => !v.isDelegating);
  },
);

export const allDirectVotesSelector = createSelector(
  allVotesSelector,
  (allVotes) => {
    return (allVotes || []).filter((v) => !v.isDelegating);
  },
);

export const allDelegationVotesSelector = createSelector(
  allVotesSelector,
  (allVotes) => {
    return (allVotes || []).filter((v) => v.isDelegating);
  },
);

export const normalizedNestedVote = (vote, delegations) => {
  if (!vote.isStandard) {
    return {
      ...vote,
      directVoterDelegations: [],
      totalVotes: vote.votes,
      totalDelegatedVotes: 0,
      totalDelegatedCapital: 0,
    };
  }

  let directVoterDelegations = delegations.filter((delegationVote) =>
    isSameAddress(delegationVote.target, vote.account),
  );
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

  return {
    ...vote,
    directVoterDelegations,
    totalVotes,
    totalDelegatedVotes,
    totalDelegatedCapital,
  };
};

export const nestedVotesSelector = createSelector(
  allDirectVotesSelector,
  allDelegationVotesSelector,
  (directVotes, delegations) => {
    const directVotesWithNested = directVotes.map((v) =>
      normalizedNestedVote(v, delegations),
    );

    const allAye = directVotesWithNested.filter((v) => v.aye);
    const allNay = directVotesWithNested.filter((v) => v.aye === false);
    const allAbstain = directVotesWithNested.filter((v) => v.isAbstain);

    return {
      allAye,
      allNay,
      allAbstain,
    };
  },
);

export const allNestedVotesSelector = createSelector(
  nestedVotesSelector,
  ({ allAye, allNay, allAbstain }) => flatten([allAye, allNay, allAbstain]),
);

export const flattenVotesSelector = createSelector(
  allAyeSelector,
  allNaySelector,
  allAbstainSelector,
  (allAye, allNay, allAbstain) => {
    return {
      allAye,
      allNay,
      allAbstain,
    };
  },
);
