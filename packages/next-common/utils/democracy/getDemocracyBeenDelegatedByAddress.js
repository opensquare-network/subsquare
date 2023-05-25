export async function getDemocracyBeenDelegatedByAddress(api, address) {
  const voting = await api.query.democracy?.votingOf(address);

  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  if (jsonVoting.delegating) {
    return jsonVoting.delegating.delegations;
  }

  if (jsonVoting.direct) {
    return jsonVoting.direct.delegations;
  }

  return null;
}
