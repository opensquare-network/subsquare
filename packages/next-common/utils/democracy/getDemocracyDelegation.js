// copied from `utils/gov2/gov2ReferendumVote`

export async function getDemocracyDelegation(api, address) {
  const voting = await api.query.democracy?.votingOf(address);
  const jsonVoting = voting?.toJSON();
  if (!jsonVoting) {
    return null;
  }

  return jsonVoting?.delegating;
}
