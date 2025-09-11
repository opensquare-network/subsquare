import { isNil } from "lodash-es";
import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import { useRemainingTime } from "next-common/components/remaining";

export default function DemotionRemainLabel({ lastProof, rank, params }) {
  const { percentageValue, remainingBlocks, demotionPeriod } =
    useDemotionPeriod({ rank, lastProof, params });
  const remaining = useRemainingTime(remainingBlocks);

  if (isNil(demotionPeriod)) {
    return null;
  }

  let text = "";
  if (demotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Expired";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label={rank <= 0 ? "Offboard" : "Demotion"}
      total={demotionPeriod}
      remain={remainingBlocks}
      text={text}
    />
  );
}
