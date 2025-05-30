import { calcVotes, sortVotes } from "./common";

async function getBalance(blockApi, account) {
  if (blockApi.query.system?.account) {
    const accountInfo = await blockApi.query.system.account(account);
    return accountInfo.data.free.toString();
  }

  if (blockApi.query.balances.freeBalance) {
    const rawBalance = await blockApi.query.balances.freeBalance(account);
    if (rawBalance) {
      return rawBalance.toString();
    }
  }

  return 0;
}

export async function getReferendumVotesFromVotersFor(
  blockApi,
  referendumIndex,
) {
  const votersFor = await blockApi.query.democracy.votersFor(referendumIndex);
  let votes = [];
  if (votersFor.length > 0) {
    votes = await blockApi.query.democracy.voteOf.multi(
      votersFor.map((addr) => [referendumIndex, addr]),
    );
  }

  const balancePromises = [];
  for (const voter of votersFor) {
    balancePromises.push(await getBalance(blockApi, voter));
  }
  const balances = await Promise.all(balancePromises);

  const normalizedVotes = votersFor.map((voter, index) => {
    const vote = votes[index] || blockApi.registry.createType("Vote");
    const balance = balances[index] || 0;
    const conviction = vote.conviction.toNumber();
    const finalVotes = calcVotes(balance, conviction);

    return {
      account: voter.toString(),
      isDelegating: false,
      aye: vote.isAye,
      conviction,
      balance,
      votes: finalVotes,
      totalVotes: finalVotes,
    };
  });

  return sortVotes(normalizedVotes);
}
