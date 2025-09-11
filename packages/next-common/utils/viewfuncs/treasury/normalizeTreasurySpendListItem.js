import { getPostLastActivityAt } from "next-common/utils/viewfuncs/postUpdatedTime";
import {
  fellowshipTreasurySpendBaseUrl,
  treasurySpendBaseUrl,
} from "next-common/utils/postBaseUrl";

function getSpendDefaultTitle(item) {
  let title = item.title?.trim();
  if (title) {
    return title;
  }

  return `Treasury spend ${item.index}`;
}

export default function normalizeTreasurySpendListItem(chain, item) {
  return {
    ...item,
    title: getSpendDefaultTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${treasurySpendBaseUrl}/${item.index}`,
  };
}

export function normalizeFellowshipTreasurySpendListItem(chain, item) {
  return {
    ...item,
    title: getSpendDefaultTitle(item),
    address: item.proposer,
    status: item.state ?? "Unknown",
    time: getPostLastActivityAt(item),
    detailLink: `${fellowshipTreasurySpendBaseUrl}/${item.index}`,
  };
}
