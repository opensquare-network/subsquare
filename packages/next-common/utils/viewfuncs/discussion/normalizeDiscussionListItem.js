export default function normalizeDiscussionListItem(chain, item) {
  return {
    ...item,
    index: item.postUid,
    time: item.lastActivityAt,
    detailLink: `/posts/${item.postUid}`,
  };
}
