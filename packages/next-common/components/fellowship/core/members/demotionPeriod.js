import { useSelector } from "react-redux";
import chainOrScanHeightSelector from "next-common/store/reducers/selectors/height";
import { usePageProps } from "next-common/context/page";
import isNil from "lodash.isnil";
import { Tooltip } from "@subsquare/next/components/gov2/sidebar/status/styled";
import Remaining from "next-common/components/remaining";
import Progress from "next-common/components/progress";
import { useMemo } from "react";
import FellowshipMemberInfoWrapper from "next-common/components/fellowship/core/members/infoWrapper";
import FellowshipMemberInfoTitle from "next-common/components/fellowship/core/members/title";

export default function FellowshipMemberDemotionPeriod({ lastProof, rank }) {
  const latestHeight = useSelector(chainOrScanHeightSelector);
  const { fellowshipParams } = usePageProps();
  const demotionPeriod = fellowshipParams.demotionPeriod[rank - 1];
  if (isNil(demotionPeriod)) {
    return null;
  }

  const gone = latestHeight - lastProof;
  const percentageValue = useMemo(() => {
    if (gone <= 0) {
      return 0;
    } else if (gone >= demotionPeriod) {
      return 100;
    }

    return Number((gone / demotionPeriod) * 100).toFixed(2);
  }, [demotionPeriod, gone]);

  const remainingBlocks = useMemo(() => {
    if (gone <= 0) {
      return demotionPeriod;
    } else if (gone >= demotionPeriod) {
      return 0;
    }

    return demotionPeriod - gone;
  }, [demotionPeriod, gone]);

  return (
    <FellowshipMemberInfoWrapper>
      <FellowshipMemberInfoTitle>Demotion Period</FellowshipMemberInfoTitle>
      <Tooltip
        content={
          remainingBlocks > 0 && (
            <Remaining blocks={remainingBlocks} percentage={percentageValue} />
          )
        }
      >
        <Progress
          percentage={percentageValue}
          bg="var(--theme100)"
          fg="var(--theme500)"
        />
      </Tooltip>
    </FellowshipMemberInfoWrapper>
  );
}
