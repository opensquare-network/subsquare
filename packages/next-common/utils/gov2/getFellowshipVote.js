export async function getFellowshipVote(api, referendumIndex, address) {
  const vote = await api.query.fellowshipCollective.voting(
    referendumIndex,
    address,
  );
  return vote.toJSON();
}
