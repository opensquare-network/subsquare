import {
  SystemVoteAye,
  SystemVoteNay,
  SystemVoteAbstain,
} from "@osn/icons/subsquare";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";
import { EMPTY_OBJECT } from "next-common/utils/consts/common";

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

// impact

export const ZERO_BIGINT = BigInt(0);

export function getConvictionZeroVotes(balance = 0) {
  return BigInt(balance) / BigInt(10);
}

export function getVotesWithConviction(balance, conviction) {
  if (conviction <= 0) {
    return getConvictionZeroVotes(balance);
  } else {
    return BigInt(balance) * BigInt(convictionToLockXNumber(conviction));
  }
}

export function absBigInt(x) {
  if (typeof x !== "bigint") {
    throw new TypeError("Input must be a BigInt");
  }
  return x < 0n ? -x : x;
}

export function getSplitVotes(aye, nay) {
  return getConvictionZeroVotes(aye) - getConvictionZeroVotes(nay);
}

export function getDirectVotes(vote, delegations) {
  if (!vote) {
    return BigInt(0);
  }

  const { isSplit, isSplitAbstain, isStandard } = vote;
  if (isSplit || isSplitAbstain) {
    const { aye = 0, nay = 0 } = vote?.vote || EMPTY_OBJECT;
    return getSplitVotes(aye, nay);
  } else if (!isStandard) {
    throw new Error("Unknown direct vote type");
  }

  const {
    balance,
    vote: { isAye, conviction },
  } = vote?.vote || {};
  const { votes: delegationVotes = 0 } = delegations;
  const selfVotes = getVotesWithConviction(balance, conviction);
  const totalVotes = selfVotes + BigInt(delegationVotes);
  return isAye ? totalVotes : BigInt(0) - totalVotes;
}

export function getDirectSupport(vote, delegations) {
  if (!vote) {
    return BigInt(0);
  }

  const { isSplit, isSplitAbstain, isStandard } = vote;
  if (isSplit) {
    const { aye = 0 } = vote?.vote || EMPTY_OBJECT;
    return BigInt(aye);
  } else if (isSplitAbstain) {
    const { aye = 0, abstain = 0 } = vote?.vote || EMPTY_OBJECT;
    return BigInt(aye) + BigInt(abstain);
  } else if (!isStandard) {
    throw new Error("Unknown direct vote type");
  }

  const {
    balance,
    vote: { isAye },
  } = vote?.vote || EMPTY_OBJECT;
  const { capital: delegationCapital = 0 } = delegations;
  let support = BigInt(0);
  if (isAye) {
    support += BigInt(balance);
    support += BigInt(delegationCapital);
  }
  return support;
}

export function getVoteActionImpact(data = EMPTY_OBJECT) {
  const preImpactVotes = getDirectVotes(data.preVote, data.delegations);
  const nowImpactVotes = getDirectVotes(data.vote, data.delegations);
  return nowImpactVotes - preImpactVotes;
}

export function getSupportVoteActionImpact(data = {}) {
  const preImpactSupport = getDirectSupport(data.preVote, data.delegations);
  const nowImpactSupport = getDirectSupport(data.vote, data.delegations);
  return nowImpactSupport - preImpactSupport;
}

export function getRemoveVoteActionImpact(data) {
  const voteImpact = getDirectVotes(data.vote, data.delegations);
  return -voteImpact;
}

export function getSupportRemoveVoteActionImpact(data) {
  const voteImpact = getDirectSupport(data.vote, data.delegations);
  return -voteImpact;
}

export function getDelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance, conviction } = EMPTY_OBJECT,
    preDelegation,
  } = data || EMPTY_OBJECT;
  if (!isStandard) {
    return ZERO_BIGINT;
  }

  let votes = getVotesWithConviction(balance, conviction);
  if (preDelegation) {
    const preVotes = getVotesWithConviction(
      preDelegation?.balance,
      preDelegation?.conviction,
    );
    votes -= preVotes;
  }
  return isAye ? votes : -votes;
}

export function getSupportDelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance } = EMPTY_OBJECT,
    preDelegation,
  } = data || EMPTY_OBJECT;
  if (!isStandard || !isAye) {
    return ZERO_BIGINT;
  }

  let support = BigInt(balance);
  if (preDelegation) {
    support -= BigInt(preDelegation?.balance || 0);
  }
  return support;
}

export function getUndelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance, conviction } = EMPTY_OBJECT,
  } = data || EMPTY_OBJECT;
  if (!isStandard) {
    return ZERO_BIGINT;
  }

  const votes = getVotesWithConviction(balance, conviction);
  return isAye ? -votes : votes;
}

export function getSupportUndelegatedActionImpact(data) {
  const {
    vote: {
      isStandard,
      vote: { vote: { isAye } = EMPTY_OBJECT } = EMPTY_OBJECT,
    } = EMPTY_OBJECT,
    delegation: { balance } = EMPTY_OBJECT,
  } = data || EMPTY_OBJECT;
  if (!isStandard || !isAye) {
    return ZERO_BIGINT;
  }

  const support = BigInt(balance);
  return -support;
}

export const getImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_BIGINT;
  }

  if (OPENGOV_ACTIONS.VOTE === type) {
    return getVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.REMOVE_VOTE === type) {
    return getRemoveVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.DELEGATED === type) {
    return getDelegatedActionImpact(data);
  } else if (OPENGOV_ACTIONS.UNDELEGATED === type) {
    return getUndelegatedActionImpact(data);
  }

  return ZERO_BIGINT;
};

export const getSupportImpactVotes = (data, type) => {
  if (!data || !type) {
    return ZERO_BIGINT;
  }

  if (OPENGOV_ACTIONS.VOTE === type) {
    return getSupportVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.REMOVE_VOTE === type) {
    return getSupportRemoveVoteActionImpact(data);
  } else if (OPENGOV_ACTIONS.DELEGATED === type) {
    return getSupportDelegatedActionImpact(data);
  } else if (OPENGOV_ACTIONS.UNDELEGATED === type) {
    return getSupportUndelegatedActionImpact(data);
  }

  return ZERO_BIGINT;
};
