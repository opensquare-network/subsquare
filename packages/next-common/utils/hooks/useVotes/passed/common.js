import BigNumber from "bignumber.js";

export function sortVotes(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.balance).gt(b.balance) ? -1 : 1;
  });
}
