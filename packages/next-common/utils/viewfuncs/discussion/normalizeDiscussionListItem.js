export default function normalizeDiscussionListItem(chain, item) {
  return {
    ...item,
    time: item.lastActivityAt,
    detailLink: `/posts/${item.postUid}`,
  };
}
