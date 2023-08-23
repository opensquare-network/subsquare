import { detailPageCategory } from "next-common/utils/consts/business/category";

export const toDiscussionListItem = (chain, item) => ({
  ...item,
  time: item.lastActivityAt,
  detailLink: `/post/${item.postUid}`,
});

export function toApiType(type) {
  if (type === detailPageCategory.TECH_COMM_MOTION) {
    return "tech-comm/motions";
  }
  if (type === detailPageCategory.DEMOCRACY_REFERENDUM) {
    return "democracy/referendums";
  }
  return `${type}s`;
}
