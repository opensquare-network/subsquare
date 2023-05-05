import { ProgressBarWrapper, ProgressGroup, ProgressInfo, Tooltip } from "../styled";
import useEnactmentPercentage from "./percentage";
import Progress from "next-common/components/progress";
import TimeDuration from "next-common/components/TimeDuration";
import { useTheme } from "styled-components";
import Remaining from "../remaining";

export default function EnactmentProgress() {
  const { percentage, period, remaining } = useEnactmentPercentage();
  const { secondaryGreen500, secondaryGreen100 } = useTheme();

  return <ProgressGroup>
    <ProgressBarWrapper>
      <Tooltip
        content={remaining > 0 && <Remaining blocks={ remaining } />}
      >
        <Progress
          percentage={percentage}
          bg={secondaryGreen100}
          fg={secondaryGreen500}
        />
      </Tooltip>
    </ProgressBarWrapper>

      <ProgressInfo>
        <span>Enactment Period</span>
        <span>
          <TimeDuration blocks={ period } />
        </span>
      </ProgressInfo>
  </ProgressGroup>;
}
