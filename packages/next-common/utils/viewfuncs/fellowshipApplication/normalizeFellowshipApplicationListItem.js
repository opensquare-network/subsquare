export default function normalizeFellowshipApplicationListItem(item) {
  return {
    ...item,
    time: item.lastActivityAt,
    detailLink: `/fellowship/applications/${item.applicationUid}`,
  };
}
