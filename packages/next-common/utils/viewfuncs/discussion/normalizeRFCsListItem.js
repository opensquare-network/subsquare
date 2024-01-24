export default function normalizeRFCsListItem(chain, item) {
  return {
    ...item,
    index: item.number,
    time: item.updated_at,
    detailLink: item.html_url,
  };
}
