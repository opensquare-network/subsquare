import { ArrowRight } from "@osn/icons/subsquare";
import dayjs from "dayjs";
import Link from "next/link";
import DvStatusTag from "next-common/components/tags/state/dv";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { isObject } from "lodash-es";

export function DetailAction({ row }) {
  return (
    <Link
      href={`/referenda/dv/cohorts/${row.id}`}
      className="inline-flex items-center justify-center w-7 h-7 border border-neutral400 rounded hover:border-neutral500"
    >
      <ArrowRight className="w-4 h-4 text-textPrimary" />
    </Link>
  );
}

export function TimeValue({ time, blockNumber }) {
  return (
    <div className="flex flex-col gap-y-1 justify-end items-end">
      <span className="text-textPrimary">{time}</span>
      <span className="text-textSecondary">#{blockNumber}</span>
    </div>
  );
}

export function ParticipationValue({ voteCount, totalCount }) {
  const participation = toPrecision((voteCount / totalCount) * 100, 0, 2);

  return (
    <Tooltip content={`Voted/Total: ${voteCount}/${totalCount}`}>
      <span className="text-textPrimary">{participation}%</span>
    </Tooltip>
  );
}

export function StatusValue({ isClosed }) {
  return <DvStatusTag state={isClosed ? "Closed" : "Ongoing"} />;
}

export function TenureValue({ row }) {
  const { startIndexer, endIndexer } = row;

  const endTimeDisplay = endIndexer ? (
    <> - {dayjs(endIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}</>
  ) : null;

  let tooltipContent = (
    <>
      <div className="text12Bold">
        #{startIndexer?.blockHeight?.toLocaleString()}
      </div>
      <div>
        Start Time:{" "}
        {dayjs(startIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    </>
  );

  if (isObject(endIndexer)) {
    tooltipContent = (
      <>
        <div className="text12Bold">
          #{startIndexer?.blockHeight?.toLocaleString()} - #
          {endIndexer?.blockHeight?.toLocaleString()}
        </div>
        <div>
          Start Time:{" "}
          {dayjs(startIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div>
          End Time: {dayjs(endIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
      </>
    );
  }

  return (
    <Tooltip content={tooltipContent}>
      <span className="text-textTertiary">
        {dayjs(startIndexer?.blockTime).format("YYYY-MM-DD")}
        {endTimeDisplay}
      </span>
    </Tooltip>
  );
}

export function W3fDelegationValue({ value }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  return (
    <ValueDisplay
      value={toPrecision(value, chainSettings.decimals)}
      symbol={symbol}
    />
  );
}
