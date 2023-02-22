import { getTitle } from "../../post";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeReferendaListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    time: getPostLastActivityAt(item),
    status: item.state ?? "Unknown",
    index: item.referendumIndex,
    address: item.proposer,
    detailLink: `/democracy/referendum/${item.referendumIndex}`,
  };
}
