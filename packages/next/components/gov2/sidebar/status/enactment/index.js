import {
  ProgressBarWrapper,
  ProgressGroup,
  ProgressInfo,
  Tooltip,
} from "../styled";
import useEnactmentPercentage from "./percentage";
import Progress from "next-common/components/progress";
import TimeDuration from "next-common/components/TimeDuration";
import Remaining from "next-common/components/remaining";

export default function EnactmentProgress() {
  const { percentage, period, remaining } = useEnactmentPercentage();

  return (
    <ProgressGroup>
      <ProgressBarWrapper>
        <Tooltip content={remaining > 0 && <Remaining blocks={remaining} />}>
          <Progress
            percentage={percentage}
            bg="var(--green100)"
            fg="var(--green500)"
          />
        </Tooltip>
      </ProgressBarWrapper>

      <ProgressInfo>
        <span>Enactment Period</span>
        <span>
          <TimeDuration blocks={period} />
        </span>
      </ProgressInfo>
    </ProgressGroup>
  );
}
