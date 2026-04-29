import { useMemo } from "react";
import { useCommittedFilterState } from "next-common/components/dropdownFilter/context";
import {
  OPENGOV_ACTIONS,
  getImpactVotes,
  getSupportImpactVotes,
  ZERO_BIGINT,
} from "./common";

export const ACTION_TYPE_FILTER_VALUES = {
  ALL: "",
  VOTE: "vote",
  CHANGE_VOTE: "changeVote",
  REMOVE_VOTE: "removeVote",
  DELEGATE: "delegate",
  CHANGE_DELEGATION: "changeDelegation",
  REMOVE_DELEGATION: "removeDelegation",
};

export const IMPACT_FILTER_VALUES = {
  ALL: "",
  INCREASE_TALLY: "increaseTally",
  DECREASE_TALLY: "decreaseTally",
  INCREASE_SUPPORT: "increaseSupport",
  DECREASE_SUPPORT: "decreaseSupport",
};

export const defaultVoteActionFilterValues = {
  actionType: ACTION_TYPE_FILTER_VALUES.ALL,
  impact: IMPACT_FILTER_VALUES.ALL,
};

function matchesActionFilter(item, voteType) {
  if (!voteType) {
    return true;
  }

  const { type, data } = item;
  const preVote = data?.preVote;
  const preDelegation = data?.preDelegation;

  switch (voteType) {
    case ACTION_TYPE_FILTER_VALUES.VOTE:
      return type === OPENGOV_ACTIONS.VOTE && !preVote;
    case ACTION_TYPE_FILTER_VALUES.CHANGE_VOTE:
      return type === OPENGOV_ACTIONS.VOTE && !!preVote;
    case ACTION_TYPE_FILTER_VALUES.REMOVE_VOTE:
      return type === OPENGOV_ACTIONS.REMOVE_VOTE;
    case ACTION_TYPE_FILTER_VALUES.DELEGATE:
      return type === OPENGOV_ACTIONS.DELEGATED && !preDelegation;
    case ACTION_TYPE_FILTER_VALUES.CHANGE_DELEGATION:
      return type === OPENGOV_ACTIONS.DELEGATED && !!preDelegation;
    case ACTION_TYPE_FILTER_VALUES.REMOVE_DELEGATION:
      return type === OPENGOV_ACTIONS.UNDELEGATED;
    default:
      return true;
  }
}

function matchesImpactFilter(item, impact) {
  if (!impact) {
    return true;
  }

  if (impact === IMPACT_FILTER_VALUES.INCREASE_TALLY) {
    return getImpactVotes(item.data, item.type) > ZERO_BIGINT;
  }
  if (impact === IMPACT_FILTER_VALUES.DECREASE_TALLY) {
    return getImpactVotes(item.data, item.type) < ZERO_BIGINT;
  }
  if (impact === IMPACT_FILTER_VALUES.INCREASE_SUPPORT) {
    return getSupportImpactVotes(item.data, item.type) > ZERO_BIGINT;
  }
  if (impact === IMPACT_FILTER_VALUES.DECREASE_SUPPORT) {
    return getSupportImpactVotes(item.data, item.type) < ZERO_BIGINT;
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
        matchesActionFilter(item, filters.actionType) &&
        matchesImpactFilter(item, filters.impact),
    );
  }, [voteActions, filters]);
}
