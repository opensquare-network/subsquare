export default async function queryReferendumInfo(api, referendumIndex) {
  const info = await api.query.referenda.referendumInfoFor(referendumIndex);
  return {
    referendumIndex,
    referendumInfo: info.toJSON(),
  };
}
