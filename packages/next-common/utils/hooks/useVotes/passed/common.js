import BigNumber from "bignumber.js";

export const emptyVotes = {
  allAye: [],
  allNay: [],
}

export function sortVotes(votes = []) {
  return votes.sort((a, b) => {
    return new BigNumber(a.balance).gt(b.balance) ? -1 : 1;
  });
}

export function normalizeVotingOfEntry([storageKey, voting], blockApi) {
  let pubKeyU8a;
  if (storageKey.length === 72) {
    pubKeyU8a = storageKey.slice(40);
  }
  if (!pubKeyU8a) {
    throw new Error(`Unexpected storage key length ${ storageKey.length }`)
  }

  const accountId = blockApi.registry.createType("AccountId", pubKeyU8a);
  const account = accountId.toString();
  return { account, voting };
}
