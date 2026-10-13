import { SystemLoadingDots } from "@osn/icons/subsquare";
import BigNumber from "bignumber.js";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { cn, toPrecision } from "next-common/utils";
import useTimesliceDate from "../hooks/useTimesliceDate";
import { bitsToCores } from "./utils";

function LoadingValue() {
  return <SystemLoadingDots width={20} height={20} />;
}

function PoolSizeValue({ pool }) {
  return (
    <span>
      {pool.cores.toLocaleString()}
      <span className="unit"> cores</span>
      <span className="total"> ({pool.bits.toLocaleString()} bits)</span>
    </span>
  );
}

function UpcomingChanges({ changes, format }) {
  if (!changes.length) {
    return <span>No upcoming pool size change</span>;
  }

  return (
    <div className="space-y-1">
      {changes.map((change) => {
        const date = format(change.timeslice);
        return (
          <div key={change.timeslice}>
            <span
              className={change.delta < 0 ? "text-red500" : "text-green500"}
            >
              {change.delta > 0 ? "+" : ""}
              {change.delta.toLocaleString()} bits
            </span>
            {` at timeslice #${change.timeslice.toLocaleString()}`}
            {date ? ` (${date})` : ""}
          </div>
        );
      })}
    </div>
  );
}

export default function PoolSummaryItems({
  systemPool,
  privatePool,
  upcomingIo = [],
  totalPayout,
  days,
  loading,
}) {
  const { decimals, symbol } = useChainSettings();
  const toDate = useTimesliceDate();
  const format = (timeslice) => {
    const date = toDate(timeslice);
    return date ? date.format("YYYY-MM-DD") : null;
  };

  const nextChange = upcomingIo[0];
  const nextChangeDate = nextChange ? format(nextChange.timeslice) : null;

  return (
    <SummaryLayout>
      <SummaryItem
        title={
          <Tooltip content="Coretime supplied to the on-demand market by the system pool. This part is owned by the protocol, its revenue is not paid to private contributors.">
            <span>System pool</span>
          </Tooltip>
        }
      >
        {loading ? <LoadingValue /> : <PoolSizeValue pool={systemPool} />}
      </SummaryItem>

      <SummaryItem
        title={
          <Tooltip content="Coretime supplied to the on-demand market by privately contributed regions. The on-demand revenue of this part belongs to the contributors.">
            <span>Private pool</span>
          </Tooltip>
        }
      >
        {loading ? <LoadingValue /> : <PoolSizeValue pool={privatePool} />}
      </SummaryItem>

      <SummaryItem
        title={
          <Tooltip
            content={<UpcomingChanges changes={upcomingIo} format={format} />}
          >
            <span>Next pool change</span>
          </Tooltip>
        }
      >
        {loading ? (
          <LoadingValue />
        ) : nextChange ? (
          <span
            className={cn(
              nextChange.delta < 0 ? "text-red500" : "text-green500",
            )}
          >
            {nextChange.delta > 0 ? "+" : ""}
            {bitsToCores(nextChange.delta).toLocaleString()}
            <span className="unit"> cores</span>
            {nextChangeDate ? (
              <span className="total"> · {nextChangeDate}</span>
            ) : null}
          </span>
        ) : (
          <span className="text-textTertiary">-</span>
        )}
      </SummaryItem>

      <SummaryItem
        title={
          <Tooltip
            content={`On-demand revenue recorded for private contributions in the last ${days} days. Contributors can take it with a claim revenue call.`}
          >
            <span>On-demand revenue</span>
          </Tooltip>
        }
      >
        {loading ? (
          <LoadingValue />
        ) : totalPayout ? (
          <ValueDisplay
            value={toPrecision(new BigNumber(totalPayout).toFixed(0), decimals)}
            symbol={symbol}
          />
        ) : (
          <span className="text-textTertiary">-</span>
        )}
      </SummaryItem>
    </SummaryLayout>
  );
}
