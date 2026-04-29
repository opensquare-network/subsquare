import { useMemo } from "react";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import { OPENGOV_ACTIONS, getImpactVotes, ZERO_BIGINT } from "./common";

export const VOTE_TYPE_FILTER_VALUES = {
  ALL: "",
  VOTE: "vote",
  CHANGE_VOTE: "changeVote",
  REMOVE_VOTE: "removeVote",
  DELEGATE: "delegate",
  CHANGE_DELEGATION: "changeDelegation",
  REMOVE_DELEGATION: "removeDelegation",
};

export const AFFECTION_FILTER_VALUES = {
  ALL: "",
  INCREASE: "increase",
  REDUCTION: "reduction",
};

export const defaultVoteActionFilterValues = {
  voteType: VOTE_TYPE_FILTER_VALUES.ALL,
  affection: AFFECTION_FILTER_VALUES.ALL,
};

function matchesActionFilter(item, voteType) {
  if (!voteType) {
    return true;
  }

  const { type, data } = item;
  const preVote = data?.preVote;
  const preDelegation = data?.preDelegation;

  switch (voteType) {
    case VOTE_TYPE_FILTER_VALUES.VOTE:
      return type === OPENGOV_ACTIONS.VOTE && !preVote;
    case VOTE_TYPE_FILTER_VALUES.CHANGE_VOTE:
      return type === OPENGOV_ACTIONS.VOTE && !!preVote;
    case VOTE_TYPE_FILTER_VALUES.REMOVE_VOTE:
      return type === OPENGOV_ACTIONS.REMOVE_VOTE;
    case VOTE_TYPE_FILTER_VALUES.DELEGATE:
      return type === OPENGOV_ACTIONS.DELEGATED && !preDelegation;
    case VOTE_TYPE_FILTER_VALUES.CHANGE_DELEGATION:
      return type === OPENGOV_ACTIONS.DELEGATED && !!preDelegation;
    case VOTE_TYPE_FILTER_VALUES.REMOVE_DELEGATION:
      return type === OPENGOV_ACTIONS.UNDELEGATED;
    default:
      return true;
  }
}

function matchesAffectionFilter(item, affection) {
  if (!affection) {
    return true;
  }

  const impactVotes = getImpactVotes(item.data, item.type);
  const isIncrease = impactVotes > ZERO_BIGINT;
  const isReduction = impactVotes < ZERO_BIGINT;

  if (affection === AFFECTION_FILTER_VALUES.INCREASE) {
    return isIncrease;
  }
  if (affection === AFFECTION_FILTER_VALUES.REDUCTION) {
    return isReduction;
  }

  return true;
}

export function useFilteredVoteActions(voteActions) {
  const [filters] = useCommittedFilterState();

  return useMemo(() => {
    if (!voteActions) {
      return [];
    }
    return voteActions.filter(
      (item) =>
        matchesActionFilter(item, filters.voteType) &&
        matchesAffectionFilter(item, filters.affection),
    );
  }, [voteActions, filters]);
}
