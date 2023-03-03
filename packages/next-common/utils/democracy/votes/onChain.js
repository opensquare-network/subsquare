import BigNumber from "bignumber.js";
import { LOCKS } from "./consts";

function normalize({ accountId, balance, isDelegating, vote }) {
  const conviction = vote.conviction.toNumber();
  const balanceString = balance.toBigInt().toString();
  const convictedBalance = new BigNumber(balanceString)
    .multipliedBy(LOCKS[conviction])
    .div(10)
    .toString();

  return {
    account: accountId.toString(),
    isDelegating,
    convictedBalance,
    balance: balanceString,
    aye: vote.isAye,
    conviction,
  };
}

function normalizeAndSort(votes = []) {
  const normalized = votes.map(normalize);
  return normalized.sort((a, b) => b.convictedBalance - a.convictedBalance);
}

export async function getOnChainReferendum(api, referendumIndex) {
  const referendums = await api.derive.democracy.referendums();
  const referendum = referendums.find(
    (referendum) => referendum.index.toNumber() === parseInt(referendumIndex),
  );

  if (!referendum) {
    return {
      allAye: [],
      allNay: [],
    };
  }

  const { allAye, allNay } = referendum;
  return {
    allAye: normalizeAndSort(allAye),
    allNay: normalizeAndSort(allNay),
  };
}
