import { isNil } from "lodash-es";
import { Conviction } from "next-common/utils/referendumCommon";

const sizing = ["0.1x", "1x", "2x", "3x", "4x", "5x", "6x"];

export default function VoteLabel({
  conviction,
  isDelegating,
  isSplit,
  isSplitAbstain,
  tab,
}) {
  if (isNil(conviction)) {
    return null;
  }

  let convictionNum = conviction;
  if (conviction in Conviction) {
    convictionNum = Conviction[conviction];
  }
  let size = sizing[convictionNum];
  if (tab === "Abstain") {
    return size;
  } else if (isDelegating) {
    return `${size}/d`;
  } else if (isSplit) {
    return `${size}/s`;
  } else if (isSplitAbstain) {
    return `${size}/sa`;
  }

  return size;
}
