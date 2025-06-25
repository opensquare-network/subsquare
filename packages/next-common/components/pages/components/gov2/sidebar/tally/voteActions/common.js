import {
  SystemVoteAye,
  SystemVoteNay,
  SystemVoteAbstain,
} from "@osn/icons/subsquare";

export const OPENGOV_ACTIONS = Object.freeze({
  VOTE: 1,
  REMOVE_VOTE: 2,
  DELEGATED: 3,
  UNDELEGATED: 4,
});

export const VOTE_ACTION_TYPES = {
  1: "Vote",
  2: "Remove Vote",
  3: "Delegate",
  4: "Remove Delegation",
};

export const VOTE_TYPES = {
  STANDARD: "standard",
  SPLIT: "split",
  SPLIT_ABSTAIN: "split abstain",
};

export const VOTE_TYPE_CONFIG = {
  aye: { icon: SystemVoteAye, label: "Aye", color: "text-green500" },
  nay: { icon: SystemVoteNay, label: "Nay", color: "text-red500" },
  abstain: {
    icon: SystemVoteAbstain,
    label: "Abstain",
    color: "text-textTertiary",
  },
};

export const isDirectVote = (type) =>
  type === OPENGOV_ACTIONS.VOTE || type === OPENGOV_ACTIONS.REMOVE_VOTE;
export const isDelegation = (type) =>
  type === OPENGOV_ACTIONS.DELEGATED || type === OPENGOV_ACTIONS.UNDELEGATED;

export function getVoteType(vote) {
  if (vote?.isStandard) {
    return VOTE_TYPES.STANDARD;
  } else if (vote?.isSplit) {
    return VOTE_TYPES.SPLIT;
  } else if (vote?.isSplitAbstain) {
    return VOTE_TYPES.SPLIT_ABSTAIN;
  }

  return null;
}

export const getVoteBalance = (voteData) => voteData?.vote?.balance;
export const getVoteConviction = (voteData) => voteData?.vote?.vote?.conviction;
export const isAyeVote = (voteData) => voteData?.vote?.vote?.isAye;

export const VOTE_LABELS = {
  DELEGATIONS: "delegations:",
  VOTES: "votes:",
  VOTE_TYPE: "vote type:",
  TO: "to:",
  FROM: "from:",
};
