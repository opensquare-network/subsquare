import styled from "styled-components";
import Progress from "next-common/components/progress";
import { useSupportThreshold } from "next-common/context/post/gov2/threshold";
import { useEffect, useMemo, useState } from "react";
import ThresholdComponent from "next-common/components/referenda/threshold";
import { isNil } from "lodash-es";
import TooltipOrigin from "next-common/components/tooltip";
import BigNumber from "bignumber.js";
import Percentage from "next-common/components/referenda/tally/support/percentage";

const Wrapper = styled.div`
  margin-top: 21px;
  padding: 0 0 8px;

  font-size: 12px;
  line-height: 16px;

  position: relative;

  ul,
  li {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  ul {
    margin-top: 4px;
    display: flex;
    justify-content: space-between;

    font-weight: 500;
    color: var(--textPrimary);
    li {
      width: 33.3%;
      &:last-child {
        text-align: right;
      }
      &:nth-child(2) {
        text-align: center;
      }
    }
  }

  p {
    margin: 0;
    text-align: center;
    color: var(--textSecondary);
  }
`;

const Mark = styled(ThresholdComponent)`
  top: 0;
  pointer-events: none;
`;

const Tooltip = styled(TooltipOrigin)`
  display: block;
  z-index: 1;
`;

const ProgressBarWrapper = styled.div`
  margin: 8px 0;
`;

export default function SupportBar({ supportPerbill }) {
  const supportThreshold = useSupportThreshold();
  // threshold in perbill
  const [threshold, setThreshold] = useState(null);
  // progress max value in perbill
  const [progressMax, setProgressMax] = useState(null);

  useEffect(() => {
    if (supportThreshold) {
      setThreshold(supportThreshold * Math.pow(10, 9));
    }
  }, [supportThreshold]);

  useEffect(() => {
    if (!isNil(threshold) && !isNil(supportPerbill)) {
      const value = BigNumber.max(supportPerbill, threshold)
        .multipliedBy(1.25)
        .toNumber();
      setProgressMax(value);
    }
  }, [supportPerbill, threshold]);

  const barPercentage = useMemo(() => {
    if (!supportPerbill || isNil(progressMax)) {
      return 0;
    }

    // when the decision period reach end, we show 100% for support bar,
    // because support threshold require 0% at the end
    if (progressMax <= 0) {
      return 100;
    }

    return Number((supportPerbill / progressMax) * 100).toFixed(2);
  }, [supportPerbill, progressMax]);

  const markPercentage = useMemo(() => {
    if (!progressMax) {
      return 0;
    }

    return `${Number((threshold / progressMax) * 100).toFixed(2)}%`;
  }, [threshold, progressMax]);

  return (
    <Wrapper>
      <Mark threshold={markPercentage} />
      <ProgressBarWrapper>
        <Tooltip
          content={
            isNil(supportPerbill) ? null : (
              <>
                Support:&nbsp;
                <Percentage perbill={supportPerbill} />
              </>
            )
          }
        >
          <Progress percentage={barPercentage} bg="var(--neutral200)" />
        </Tooltip>
      </ProgressBarWrapper>
      <ul className="text12Medium">
        <li>0.0%</li>
        <li>
          <TooltipOrigin
            className="cursor-pointer"
            contentClassName="max-w-[240px]"
            content="The minimum percentage of support needed for the proposal to pass."
          >
            <div className=" flex flex-col">
              <Percentage perbill={threshold} />
              <p className="text12Medium">Threshold</p>
            </div>
          </TooltipOrigin>
        </li>
        <li>
          <Percentage perbill={progressMax} />
        </li>
      </ul>
    </Wrapper>
  );
}
