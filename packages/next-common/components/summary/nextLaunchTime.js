import React, { useMemo } from "react";
import { SummaryGreyText, SummaryTitle } from "./styled";
import Content from "./cardContent";
import Tooltip from "../tooltip";
import { extractTime } from "@polkadot/util";
import useLatestBlockTime from "../../utils/hooks/useBlockTime";
import dayjs from "dayjs";

function useEstimateTime(ms) {
  const { days, hours, minutes, seconds } = extractTime(ms);

  const render = (number, unit, plural = "s") => (
    <>
      {number}{" "}
      <SummaryGreyText>
        {unit}
        {number > 1 ? plural : ""}{" "}
      </SummaryGreyText>
    </>
  );

  return useMemo(
    () =>
      [
        days && render(days, "day"),
        hours && render(hours, "hr"),
        minutes && render(minutes, "min"),
        seconds && render(minutes, "s", ""),
      ]
        .filter(Boolean)
        .slice(0, 2),
    [ms]
  );
}

export default function SummaryNextLaunchTime({ nextLaunchTimestamp = 0 }) {
  const latestBlockTime = useLatestBlockTime();

  const nextLaunchTimestampMilliseconds = nextLaunchTimestamp * 1000;
  const offset = nextLaunchTimestampMilliseconds - latestBlockTime;
  const time = useEstimateTime(offset);

  return (
    <>
      <SummaryTitle>Next Launch Time</SummaryTitle>

      {!!nextLaunchTimestamp && !!latestBlockTime && (
        <Content>
          <Tooltip
            content={dayjs(nextLaunchTimestampMilliseconds).format(
              "YYYY-MM-DD HH:MM:ss"
            )}
          >
            <span>
              <SummaryGreyText>In</SummaryGreyText> {time}
            </span>
          </Tooltip>
        </Content>
      )}
    </>
  );
}
