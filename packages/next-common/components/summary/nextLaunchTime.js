import React from "react";
import { SummaryTitle } from "./styled";
import Content from "./cardContent";
import Tooltip from "../tooltip";
import { extractTime } from "@polkadot/util";
import useLatestBlockTime from "../../utils/hooks/useBlockTime";
import dayjs from "dayjs";

export default function SummaryNextLaunchTime({ nextLaunchTimestamp }) {
  const latestBlockTime = useLatestBlockTime();

  const nextLaunchTimestampMilliseconds = nextLaunchTimestamp * 1000;

  return (
    <>
      <SummaryTitle>Next Launch Time</SummaryTitle>
      <Content>
        <Tooltip
          content={
            nextLaunchTimestamp &&
            dayjs(nextLaunchTimestampMilliseconds).format("YYYY-MM-DD HH:MM:ss")
          }
        >
          <span>{nextLaunchTimestampMilliseconds}</span>
        </Tooltip>
      </Content>
    </>
  );
}
