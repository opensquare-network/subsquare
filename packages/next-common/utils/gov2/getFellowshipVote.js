export async function getFellowshipVote(api, referendumIndex, address, pallet) {
  const vote = await api.query[pallet].voting(referendumIndex, address);
  return vote.toJSON();
}
