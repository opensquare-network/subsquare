import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime, toPrecision } from "next-common/utils";
import { SummaryGreyText } from "next-common/components/summary/styled";
import Summary from "next-common/components/summary/v2/base";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import Gov2TrackSummaryThresholdCurves from "./gov2TrackSummaryThresholdCurves";

export default function Gov2TrackSummary({ summary, period }) {
  const {
    maxDeciding,
    preparePeriod,
    decisionPeriod,
    confirmPeriod,
    decisionDeposit,
    minEnactmentPeriod,
  } = period ?? {};

  const { decimals, symbol } = useChainSettings();

  const blockTime = useSelector(blockTimeSelector);
  const preparePeriodBlockTime = estimateBlocksTime(preparePeriod, blockTime);
  const decisionPeriodBlockTime = estimateBlocksTime(decisionPeriod, blockTime);
  const confirmPeriodBlockTime = estimateBlocksTime(confirmPeriod, blockTime);
  const minEnactPeriodBlockTime = estimateBlocksTime(
    minEnactmentPeriod,
    blockTime,
  );

  return (
    <div className="flex max-md:flex-col max-md:space-y-4">
      <Summary
        className="!grid-cols-3 max-md:!grid-cols-2 !w-auto grow"
        items={[
          {
            title: "Capacity",
            content: (
              <span>
                {summary.decidingCount || 0}
                <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Confirm Period",
            content: (
              <span>
                {confirmPeriodBlockTime[0] || 0}
                <SummaryGreyText> {confirmPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Prepare Period",
            content: (
              <span>
                {preparePeriodBlockTime[0] || 0}
                <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Decision Period",
            content: (
              <span>
                {decisionPeriodBlockTime[0] || 0}
                <SummaryGreyText> {decisionPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Min Enact Period",
            content: (
              <span>
                {minEnactPeriodBlockTime[0] || 0}
                <SummaryGreyText> {minEnactPeriodBlockTime[1]}</SummaryGreyText>
              </span>
            ),
          },
          {
            title: "Decision Deposit",
            content: (
              <span>
                <ValueDisplay
                  value={toPrecision(decisionDeposit, decimals)}
                  symbol={symbol}
                />
              </span>
            ),
          },
        ]}
      />

      <Gov2TrackSummaryThresholdCurves period={period} />
    </div>
  );
}
