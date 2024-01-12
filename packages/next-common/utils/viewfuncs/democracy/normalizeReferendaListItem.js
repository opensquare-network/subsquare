import { getTitle } from "../../post";
import { democracyReferendumBaseUrl } from "../../postBaseUrl";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeReferendaListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    time: getPostLastActivityAt(item),
    status: item.state ?? "Unknown",
    index: item.referendumIndex,
    address: item.proposer || (item.onchainData?.authors || [])[0],
    detailLink: `${democracyReferendumBaseUrl}/${item.referendumIndex}`,
  };
}
