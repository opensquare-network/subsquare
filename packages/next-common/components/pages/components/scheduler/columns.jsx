import Tooltip from "next-common/components/tooltip";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import CallColumnContent from "./callColumnContent";
import { useMemo } from "react";
import Duration from "next-common/components/duration";
import dayjs from "dayjs";
import { useExecutionTimeContext } from "./context";
import { useRelayChainBlockApi } from "next-common/context/relayChain/blockApi";
import LoadableContent from "next-common/components/common/loadableContent";

function ExecutionTimeButton() {
  const { isTime, toggleIsTime } = useExecutionTimeContext();
  return (
    <button className="text-theme500" onClick={toggleIsTime}>
      {isTime ? "Time" : "Age"}
    </button>
  );
}

export function useExecutionTimeColumn() {
  return useMemo(
    () => ({
      name: <ExecutionTimeButton />,
      width: 220,
      className: "min-w-[200px]",
      render: ({ blockNumber }) => (
        <ExecutionTimeColumnContent height={blockNumber} />
      ),
    }),
    [],
  );
}

export function PeriodicColumn() {
  return {
    key: "interval",
    name: "Interval",
    width: 180,
    render: ({ maybePeriodic, blockNumber }) => (
      <PeriodicColumnContent
        blockNumber={blockNumber}
        periodic={maybePeriodic}
      />
    ),
  };
}

export function OriginColumn() {
  return {
    name: "Origin",
    key: "origin",
    width: 140,
    render: ({ originRole }) => originRole,
  };
}

export function CallColumn() {
  return {
    key: "call",
    name: "Call",
    className: "text-right",
    render: ({ call }) => <CallColumnContent call={call} />,
  };
}

const staticColumns = [PeriodicColumn(), OriginColumn(), CallColumn()];

export function useColumnsDef() {
  const executionTimeColumn = useExecutionTimeColumn();

  return useMemo(
    () => [executionTimeColumn, ...staticColumns],
    [executionTimeColumn],
  );
}

function ExecutionTimeColumnContent({ height }) {
  const api = useRelayChainBlockApi();
  const { isTime } = useExecutionTimeContext();
  const { timestamp, isLoading } = useBlockTimestamp(height, api);

  if (!timestamp && !isLoading) {
    return "-";
  }

  let content;

  if (isTime) {
    content = dayjs(timestamp).format("YYYY-MM-DD HH:mm:ss");
  } else {
    content = <Duration time={timestamp} />;
  }

  return (
    <LoadableContent size={20} isLoading={isLoading}>
      <Tooltip content={`#${height?.toLocaleString()}`}>{content}</Tooltip>
    </LoadableContent>
  );
}

function PeriodicColumnContent({ periodic, blockNumber }) {
  const oneBlockTime = useSelector(blockTimeSelector);
  const [period, count] = periodic ?? [];
  const { timestamp: nextExecutionTime } = useBlockTimestamp(
    blockNumber + period,
  );

  if (!periodic || !nextExecutionTime) {
    return "-";
  }

  return (
    <Tooltip content={`Period: ${period} blocks, Remaining times: ${count}`}>
      {formatTimeDuration(oneBlockTime * period)}
    </Tooltip>
  );
}
