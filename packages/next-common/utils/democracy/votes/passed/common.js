import BigNumber from "bignumber.js";
import { LOCKS } from "../consts";

export const emptyVotes = {
  allAye: [],
  allNay: [],
};

export const openGovEmptyVotes = {
  allAye: [],
  allNay: [],
  allAbstain: [],
};

export function calcVotes(capital = 0, conviction = 0) {
  return new BigNumber(capital)
    .multipliedBy(LOCKS[conviction])
    .div(10)
    .toFixed(1, 1);
}

export function objectSpread(dest, ...sources) {
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];

    if (src) {
      Object.assign(dest, src);
    }
  }

  return dest;
}

export function sortVotesByBalance(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.balance).gt(b.balance) ? -1 : 1;
  });
}

export function sortVotes(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.votes).gt(b.votes) ? -1 : 1;
  });
}

export function sortTotalVotes(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.totalVotes || 0).gt(b.totalVotes || 0) ? -1 : 1;
  });
}

export function sortVotesWithConviction(votes = []) {
  return votes.sort((a, b) => {
    const ta = new BigNumber(a.balance)
      .multipliedBy(LOCKS[a.conviction])
      .div(10);
    const tb = new BigNumber(b.balance)
      .multipliedBy(LOCKS[b.conviction])
      .div(10);
    return new BigNumber(ta).gt(tb) ? -1 : 1;
  });
}

export function normalizeVotingOfEntry([storageKey, voting]) {
  const {
    args: [accountId],
  } = storageKey;
  const account = accountId.toString();
  return { account, voting };
}
