import {
  SystemVoteAye,
  SystemVoteNay,
  SystemVoteAbstain,
} from "@osn/icons/subsquare";

export const VOTE_ACTION_TYPES = {
  1: "Vote",
  2: "Remove Vote",
  3: "Delegate",
  4: "Remove Delegation",
};

export const VOTE_TYPES = {
  STANDARD: "Standard",
  SPLIT: "Split",
  SPLIT_ABSTAIN: "SplitAbstain",
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

export const isDirectVote = (type) => type === 1 || type === 2;
export const isDelegation = (type) => type === 3 || type === 4;

export function getVoteType(data) {
  if (data?.isStandard) {
    return VOTE_TYPES.STANDARD;
  }

  if (data?.isSplit) {
    return VOTE_TYPES.SPLIT;
  }

  if (data?.isSplitAbstain) {
    return VOTE_TYPES.SPLIT_ABSTAIN;
  }

  return null;
}
