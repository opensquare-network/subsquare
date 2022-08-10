function normalize({ accountId, balance, isDelegating, vote }) {
  return {
    account: accountId.toString(),
    isDelegating,
    balance: balance.toBigInt().toString(),
    vote,
  }
}

export async function getOnChainReferendum(api, referendumIndex) {
  const referendums = await api.derive.democracy.referendums()
  const referendum = referendums.find(referendum => referendum.index.toNumber() === parseInt(referendumIndex));

  if (!referendum) {
    return {
      allAye: [],
      allNay: [],
    }
  }

  const { allAye, allNay } = referendum;
  return {
    allAye: allAye.map(normalize),
    allNay: allNay.map(normalize),
  }
}
