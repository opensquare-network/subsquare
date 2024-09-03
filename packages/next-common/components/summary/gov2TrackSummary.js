import { useSelector } from "react-redux";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { estimateBlocksTime, toPrecision } from "next-common/utils";
import { SummaryGreyText } from "next-common/components/summary/styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import Gov2TrackSummaryThresholdCurves from "./gov2TrackSummaryThresholdCurves";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import TrackStatus from "./trackStatus";

function SummaryItems({ summary, period }) {
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
  const preparePeriodBlockTime = estimateBlocksTime(
    preparePeriod,
    blockTime,
  ).split(" ");
  const decisionPeriodBlockTime = estimateBlocksTime(
    decisionPeriod,
    blockTime,
  ).split(" ");
  const confirmPeriodBlockTime = estimateBlocksTime(
    confirmPeriod,
    blockTime,
  ).split(" ");
  const minEnactPeriodBlockTime = estimateBlocksTime(
    minEnactmentPeriod,
    blockTime,
  ).split(" ");

  return (
    <SummaryLayout className="!grid-cols-3 max-md:!grid-cols-2 !w-auto grow">
      <SummaryItem title="Capacity">
        <span>
          {(summary.decidingCount || 0) + (summary.confirmingCount || 0)}
          <SummaryGreyText> / {maxDeciding}</SummaryGreyText>
        </span>
      </SummaryItem>
      <SummaryItem title="Confirm Period">
        <span>
          {confirmPeriodBlockTime[0] || 0}
          <SummaryGreyText> {confirmPeriodBlockTime[1]}</SummaryGreyText>
        </span>
      </SummaryItem>
      <SummaryItem title="Prepare Period">
        <span>
          {preparePeriodBlockTime[0] || 0}
          <SummaryGreyText> {preparePeriodBlockTime[1]}</SummaryGreyText>
        </span>
      </SummaryItem>
      <SummaryItem title="Decision Period">
        <span>
          {decisionPeriodBlockTime[0] || 0}
          <SummaryGreyText> {decisionPeriodBlockTime[1]}</SummaryGreyText>
        </span>
      </SummaryItem>
      <SummaryItem title="Min Enact Period">
        <span>
          {minEnactPeriodBlockTime[0] || 0}
          <SummaryGreyText> {minEnactPeriodBlockTime[1]}</SummaryGreyText>
        </span>
      </SummaryItem>
      <SummaryItem title="Decision Deposit">
        <span>
          <ValueDisplay
            value={toPrecision(decisionDeposit, decimals)}
            symbol={symbol}
          />
        </span>
      </SummaryItem>
    </SummaryLayout>
  );
}

export default function Gov2TrackSummary({ summary, period }) {
  return (
    <div className="flex flex-col grow">
      <div className="flex max-md:flex-col max-md:space-y-4">
        <SummaryItems summary={summary} period={period} />
        <Gov2TrackSummaryThresholdCurves period={period} />
      </div>
      <TrackStatus />
    </div>
  );
}
