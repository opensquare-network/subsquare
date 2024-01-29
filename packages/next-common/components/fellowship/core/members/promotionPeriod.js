import { usePageProps } from "next-common/context/page";
import isNil from "lodash.isnil";
import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import FellowshipMemberInfoWrapper from "next-common/components/fellowship/core/members/infoWrapper";
import FellowshipMemberInfoTitle from "next-common/components/fellowship/core/members/title";
import { useMemo } from "react";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";
import { BlockTooltip } from "next-common/components/tooltip";

export default function FellowshipMemberPromotionPeriod({
  lastPromotion,
  rank,
}) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();
  const index = rank > 0 ? rank - 1 : 0;
  const promotionPeriod = fellowshipParams.minPromotionPeriod[index];

  const gone = latestHeight - lastPromotion;
  const percentageValue = useMemo(() => {
    if (gone <= 0) {
      return 0;
    } else if (gone >= promotionPeriod) {
      return 100;
    }

    return Number((gone / promotionPeriod) * 100).toFixed(2);
  }, [promotionPeriod, gone]);

  const remainingBlocks = useMemo(() => {
    if (gone <= 0) {
      return promotionPeriod;
    } else if (gone >= promotionPeriod) {
      return 0;
    }

    return promotionPeriod - gone;
  }, [promotionPeriod, gone]);

  if (isNil(promotionPeriod)) {
    return null;
  }

  return (
    <FellowshipMemberInfoWrapper>
      <FellowshipMemberInfoTitle>Promotion Period</FellowshipMemberInfoTitle>
      <BlockTooltip
        content={
          <Remaining blocks={remainingBlocks} percentage={percentageValue} />
        }
      >
        <Progress
          percentage={percentageValue}
          bg="var(--theme100)"
          fg="var(--theme500)"
        />
      </BlockTooltip>
    </FellowshipMemberInfoWrapper>
  );
}
