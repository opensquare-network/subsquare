import { isNil } from "lodash-es";
import { usePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import { useRemainingTime } from "next-common/components/remaining";

export default function PromotionRemainLabel({ lastPromotion, rank, params }) {
  const { percentageValue, remainingBlocks, promotionPeriod } =
    usePromotionPeriod({ rank, lastPromotion, params });

  const remaining = useRemainingTime(remainingBlocks);

  if (isNil(promotionPeriod)) {
    return null;
  }

  let text = "";
  if (promotionPeriod > 0) {
    if (percentageValue !== 100) {
      text = remaining;
    } else {
      text = "Promotable";
    }
  }

  return (
    <RemainLabel
      percentage={percentageValue}
      label="Promotion"
      total={promotionPeriod}
      remain={remainingBlocks}
      text={text}
    />
  );
}
