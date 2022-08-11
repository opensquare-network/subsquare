import { sortVotes } from "./common";

async function getBalance(blockHash, blockApi, account) {
  if (blockApi.query.system?.account) {
    const accountInfo = await blockApi.query.system.account(account);
    return accountInfo.data.free.toString();
  }

  if (blockApi.query.balances.freeBalance) {
    const rawBalance = await blockApi.query.balances.freeBalance(account);
    if (rawBalance) {
      return rawBalance.toString()
    }
  }

  return 0;
}

export async function getReferendumVotesFromVotersFor(blockApi, blockHash, referendumIndex) {
  const votersFor = await blockApi.query.democracy.votersFor(referendumIndex);
  let votes = [];
  if (votersFor.length > 0) {
    votes = await blockApi.query.democracy.voteOf.multi(votersFor.map(addr => ([referendumIndex, addr])));
  }

  const balancePromises = [];
  for (const voter of votersFor) {
    balancePromises.push(await getBalance(blockHash, blockApi, voter))
  }
  const balances = await Promise.all(balancePromises);

  const normalizedVotes = votersFor.map((voter, index) => {
    return {
      account: voter.toString(),
      isDelegating: false,
      vote: votes[index] || blockApi.registry.createType('Vote'),
      balance: balances[index] || 0,
    }
  })

  const sorted = sortVotes(normalizedVotes);
  const allAye = sorted.filter(v => v.vote.isAye);
  const allNay = sorted.filter(v => !v.vote.isAye);
  return { allAye, allNay };
}
