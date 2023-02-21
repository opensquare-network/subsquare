export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/post/${item.postUid}`,
});

export function toApiType(type) {
  if (type === "treasury/bounty") {
    return "treasury/bounties";
  }
  return `${type}s`;
}
