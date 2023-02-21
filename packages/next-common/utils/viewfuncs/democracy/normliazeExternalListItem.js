import { getTitle } from "@subsquare/next/utils/viewfuncs/common";
import { getPostLastActivityAt } from "../postUpdatedTime";

export default function normalizeExternalListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    address: item.proposer,
    time: getPostLastActivityAt(item),
    hash: item.externalProposalHash,
    status: item.state ?? "Unknown",
    detailLink: `/democracy/external/${ item.indexer.blockHeight }_${ item.externalProposalHash }`,
  }
}
