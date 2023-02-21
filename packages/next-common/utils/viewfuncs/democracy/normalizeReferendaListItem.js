import { getTitle } from "@subsquare/next/utils/viewfuncs/common";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeReferendaListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    time: getPostLastActivityAt(item),
    status: item.state ?? "Unknown",
    index: item.referendumIndex,
    author: item.author,
    address: item.proposer,
    detailLink: `/democracy/referendum/${ item.referendumIndex }`,
  }
}
