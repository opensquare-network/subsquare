export async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.democracy.referendumInfoOf(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
  };
}

export default async function getReferendaInfo(api, referendaIndexes = []) {
  const promises = [];
  for (const referendumIndex of referendaIndexes) {
    promises.push(queryReferendumInfo(api, referendumIndex));
  }
  return await Promise.all(promises);
}
