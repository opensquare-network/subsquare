import { extractTime } from "@polkadot/util";
import dayjs from "dayjs";
import CountDown from "next-common/components/summary/countDown";
import { SummaryGreyText } from "next-common/components/summary/styled";
import Summary from "next-common/components/summary/v2/base";
import Tooltip from "next-common/components/tooltip";
import { useChain, useChainSettings } from "next-common/context/chain";
import { useDemocracySummaryData } from "next-common/hooks/useDemoracySummaryData";
import Chains from "next-common/utils/consts/chains";
import useLatestBlockTime from "next-common/utils/hooks/useBlockTime";
import { Fragment, useMemo } from "react";
import useNextLaunchTimestamp from "next-common/hooks/democracy/kintsugi/useNextLaunchTimestamp";
import useLaunchPeriod from "next-common/hooks/democracy/useLaunchPeriod";
import { useSelector } from "react-redux";
import {
  blockTimeSelector,
  latestHeightSelector,
} from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime } from "next-common/utils";
import useApi from "next-common/utils/hooks/useApi";
import useLaunchProgress from "next-common/hooks/democracy/useLaunchProgress";

export default function DemocracySummary({ summary = {} }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const hasDemocracy = chainSettings.hasDemocracy !== false;
  const summaryData = useDemocracySummaryData(summary);

  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  const progress = useLaunchProgress();
  const api = useApi();
  const showLaunchPeriod = !isKintsugi && hasDemocracy && api;

  return (
    <Summary
      items={[
        {
          title: "Referenda",
          content: (
            <span>
              {summaryData.referenda?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summaryData.referenda?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },
        {
          title: "Proposals",
          content: (
            <span>
              {summaryData.publicProposals?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summaryData.publicProposals?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },

        showLaunchPeriod && {
          title: "Launch Period",
          content: <LaunchPeriod />,
          suffix: <CountDown percent={progress ?? 0} />,
        },

        isKintsugi && {
          title: "Next Launch Time",
          content: <NextLaunchTime />,
        },
      ].filter(Boolean)}
    />
  );
}

function LaunchPeriod() {
  const launchPeriod = useLaunchPeriod();
  const blockHeight = useSelector(latestHeightSelector);
  const goneBlocks = blockHeight % launchPeriod;
  const blockTime = useSelector(blockTimeSelector);
  const timeArray = estimateBlocksTime(launchPeriod - goneBlocks, blockTime);
  const total = estimateBlocksTime(launchPeriod, blockTime);

  if (!launchPeriod || !blockHeight) {
    return null;
  }

  return (
    <>
      {(timeArray || []).map((item, index) => (
        <span className={index % 2 === 1 ? "unit" : ""} key={index}>
          {item}
        </span>
      ))}
      <span className="total">/</span>
      {(total || []).map((item, index) => (
        <span className={index % 2 === 1 ? "unit total" : "total"} key={index}>
          {item}
        </span>
      ))}
    </>
  );
}

function NextLaunchTime() {
  const latestBlockTime = useLatestBlockTime();

  const nextLaunchTimestamp = useNextLaunchTimestamp();
  const nextLaunchTimestampMilliseconds = nextLaunchTimestamp * 1000;
  const offset = nextLaunchTimestampMilliseconds - latestBlockTime;
  const time = useEstimateTime(offset);

  return (
    <>
      {!!nextLaunchTimestamp && !!latestBlockTime && (
        <Tooltip
          content={dayjs(nextLaunchTimestampMilliseconds).format(
            "YYYY-MM-DD HH:MM:ss",
          )}
        >
          <span>
            <SummaryGreyText>≈ In</SummaryGreyText> {time}
          </span>
        </Tooltip>
      )}
    </>
  );
}

function useEstimateTime(ms) {
  const { days, hours, minutes, seconds } = extractTime(ms);

  const render = (number, unit, suffix = "s") => (
    <Fragment key={unit}>
      {number}{" "}
      <SummaryGreyText>
        {unit}
        {number > 1 ? suffix : ""}{" "}
      </SummaryGreyText>
    </Fragment>
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
    [ms],
  );
}
