export default function normalizeFellowshipApplicationListItem(item) {
  return {
    ...item,
    index: item.applicationUid,
    time: item.lastActivityAt,
    detailLink: `/fellowship/applications/${item.applicationUid}`,
  };
}
