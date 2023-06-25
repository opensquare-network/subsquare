import { extractTime } from "@polkadot/util";
import dayjs from "dayjs";
import CountDown from "next-common/components/summary/countDown";
import DemocracySummaryFooter from "next-common/components/summary/democracySummaryFooter";
import { SummaryGreyText } from "next-common/components/summary/styled";
import Summary from "next-common/components/summary/v2/base";
import Tooltip from "next-common/components/tooltip";
import { useChain, useChainSettings } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import useLatestBlockTime from "next-common/utils/hooks/useBlockTime";
import { useMemo } from "react";

export default function DemocracySummary({ summary = {} }) {
  const chain = useChain();
  const chainSettings = useChainSettings();
  const hasDemocracy = chainSettings.hasDemocracy !== false;

  const isKintsugi = [Chains.kintsugi, Chains.interlay].includes(chain);
  const showLaunchPeriod = !isKintsugi && hasDemocracy;

  return (
    <Summary
      items={[
        {
          title: "Proposals",
          content: (
            <span>
              {summary.publicProposals?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summary.publicProposals?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },
        {
          title: "Referenda",
          content: (
            <span>
              {summary.referenda?.active || 0}
              <SummaryGreyText>
                {" "}
                / {summary.referenda?.all || 0}
              </SummaryGreyText>
            </span>
          ),
        },

        showLaunchPeriod && {
          title: "Launch Period",
          content: (
            <>
              {(summary?.launchPeriod || []).map((item, index) => (
                <span className={index % 2 === 1 ? "unit" : ""} key={index}>
                  {item}
                </span>
              ))}
              {(summary?.totalPeriod || []).map((item, index) => (
                <span
                  className={index % 2 === 1 ? "unit total" : "total"}
                  key={index}
                >
                  {item}
                </span>
              ))}
            </>
          ),
          suffix: <CountDown percent={summary?.progress ?? 0} />,
        },

        isKintsugi && {
          title: "Next Launch Time",
          content: (
            <NextLaunchTime nextLaunchTimestamp={summary.nextLaunchTimestamp} />
          ),
        },
      ].filter(Boolean)}
      footer={hasDemocracy && !isKintsugi && <DemocracySummaryFooter />}
    />
  );
}

function NextLaunchTime({ nextLaunchTimestamp = 0 }) {
  const latestBlockTime = useLatestBlockTime();

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
    <>
      {number}{" "}
      <SummaryGreyText>
        {unit}
        {number > 1 ? suffix : ""}{" "}
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
    [ms],
  );
}
