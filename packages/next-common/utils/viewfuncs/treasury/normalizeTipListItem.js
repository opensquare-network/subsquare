import { getPostLastActivityAt } from "../postUpdatedTime";
import { getTitle } from "../../post";

export const TipStateMap = {
  NewTip: "Tipping",
  tip: "Tipping",
  Tipping: "Tipping",
  TipRetracted: "Retracted",
  TipClosed: "Closed",
};

export function getTipState(state) {
  if (!state) {
    return "Unknown";
  }
  return TipStateMap[state.state ?? state] === "Tipping"
    ? `Tipping (${state.tipsCount})`
    : TipStateMap[state.state ?? state];
}

export default function normalizeTipListItem(chain, item) {
  return {
    ...item,
    title: getTitle(item),
    address: item.finder,
    status: getTipState(item.state),
    time: getPostLastActivityAt(item),
    detailLink: `/treasury/tip/${ item.height }_${ item.hash }`,
    value:
      getTipState(item.state) === "Retracted"
        ? null
        : item?.onchainData?.medianValue,
  }
}
