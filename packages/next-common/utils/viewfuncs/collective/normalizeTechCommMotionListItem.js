import { getMotionId } from "../../motion";
import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";
import Chains from "../../consts/chains";
import { techCommMotionBaseUrl } from "../../postBaseUrl";

export default function normalizeTechCommMotionListItem(chain, item) {
  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  let isDemocracy = item?.onchainData?.externalProposals?.length > 0;
  if (isKintsugi) {
    isDemocracy = item?.onchainData?.publicProposals?.length > 0;
  }

  return {
    ...item,
    title: getTitle(item),
    address: item.proposer,
    status: item?.state ?? "Unknown",
    detailLink: `${techCommMotionBaseUrl}/${getMotionId(item)}`,
    time: getPostLastActivityAt(item),
    isDemocracy,
  };
}
