export default function normalizeDiscussionListItem(chain, item) {
  return {
    ...item,
    time: item.lastActivityAt,
    detailLink: `/post/${ item.postUid }`,
  }
}
