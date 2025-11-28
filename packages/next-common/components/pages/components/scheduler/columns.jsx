import Tooltip from "next-common/components/tooltip";
import SwitchableTime from "next-common/components/time/switchableTime";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";
import CallColumnContent from "./callColumnContent";

export function ExecutionTimeColumn() {
  return {
    name: "Execution Time",
    key: "executionTime",
    width: 220,
    render: ({ blockNumber }) => (
      <ExecutionTimeColumnContent height={blockNumber} />
    ),
  };
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

const columnDefs = [
  ExecutionTimeColumn(),
  PeriodicColumn(),
  OriginColumn(),
  CallColumn(),
];

export default columnDefs;

function ExecutionTimeColumnContent({ height }) {
  const { timestamp } = useBlockTimestamp(height);
  return (
    <div className="[&_span]:text14Medium [&_span]:text-textPrimary">
      <SwitchableTime timestamp={timestamp} />
    </div>
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
