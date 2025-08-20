import { ArrowRight } from "@osn/icons/subsquare";
import dayjs from "dayjs";
import { isNil } from "lodash-es";
import Link from "next/link";
import DvStatusTag from "next-common/components/tags/state/dv";
import Tooltip from "next-common/components/tooltip";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import SecondaryButton from "next-common/lib/button/secondary";
import { toPrecision } from "next-common/utils";

export function DetailAction({ row }) {
  return (
    <Link href={`/referenda/cohort/${row.id}`}>
      <SecondaryButton key="action" size="icon" className="p-0 w-7 h-7">
        <ArrowRight />
      </SecondaryButton>
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

export function StatusValue({ row }) {
  const { endIndexer } = row;
  const isEnded = !isNil(endIndexer);
  return <DvStatusTag state={isEnded ? "Inactive" : "Ongoing"} />;
}

export function TenureValue({ row }) {
  const { startIndexer, endIndexer } = row;
  return (
    <Tooltip
      content={
        <>
          <div className="text12Bold">
            # {startIndexer?.blockHeight}
            {endIndexer ? <> - # {endIndexer?.blockHeight}</> : null}
          </div>
          <div>
            Start Time:{" "}
            {dayjs(startIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
          </div>
          {endIndexer ? (
            <div>
              End Time:{" "}
              {dayjs(endIndexer?.blockTime).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          ) : null}
        </>
      }
    >
      <span className="text-textTertiary">
        {dayjs(startIndexer?.blockTime).format("YYYY-MM-DD")}
        {endIndexer ? (
          <> - {dayjs(endIndexer?.blockTime).format("YYYY-MM-DD")}</>
        ) : null}
      </span>
    </Tooltip>
  );
}

export function W3fDelegationValue({ row }) {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const { delegation } = row;
  return (
    <ValueDisplay
      value={toPrecision(delegation, chainSettings.decimals)}
      symbol={symbol}
    />
  );
}
