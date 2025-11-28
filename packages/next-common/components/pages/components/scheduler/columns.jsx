import usePreimage from "next-common/hooks/usePreimage";
import useCallDetail from "./hooks/useCallDetail";
import { TagWrapper } from "next-common/components/comment/voteTag/referendaVoteTag";
import { ThemedTag } from "next-common/components/tags/state/styled";
import Tooltip from "next-common/components/tooltip";
import { InfoDocs } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import {
  convertProposalForJsonView,
  convertProposalForTableView,
} from "next-common/components/proposal";
import { useChain } from "next-common/context/chain";
import RawCallProvider from "next-common/context/call/raw";
import SwitchableTime from "next-common/components/time/switchableTime";
import useBlockTimestamp from "next-common/hooks/common/useBlockTimestamp";
import normalizeCall from "next-common/components/democracy/metadata/normalize";
import { blockTimeSelector } from "next-common/store/reducers/chainSlice";
import { useSelector } from "react-redux";
import { formatTimeDuration } from "next-common/utils/viewfuncs/formatTimeDuration";

const CallDetailPopup = dynamicPopup(() =>
  import("next-common/components/callDetailPopup"),
);

export function AgendaExecutionTimeColumn() {
  return {
    name: "Execution Time",
    key: "executionTime",
    width: 220,
    render: ({ blockNumber }) => <ExecutionTimeColumn height={blockNumber} />,
  };
}

export function AgendaOriginColumn() {
  return {
    name: "Origin",
    key: "origin",
    width: 140,
    render: ({ originRole }) => <div>{originRole}</div>,
  };
}

export function AgendaCallColumn() {
  return {
    key: "call",
    name: "Call",
    className: "text-right",
    render: ({ call }) => <CallColumn call={call} />,
  };
}

export function AgendPeriodicColumn() {
  return {
    key: "schedule",
    name: "Interval",
    width: 280,
    render: ({ maybePeriodic, blockNumber }) => (
      <PeriodicColumn blockNumber={blockNumber} periodic={maybePeriodic} />
    ),
  };
}

const columnDefs = [
  AgendaExecutionTimeColumn(),
  AgendPeriodicColumn(),
  AgendaOriginColumn(),
  AgendaCallColumn(),
];

export default columnDefs;

function CallColumn({ call }) {
  if (call?.inline) {
    return <InlineCallColumn hash={call?.inline} />;
  }

  return <PreimageColumn hash={call?.lookup?.hash} />;
}

function InlineCallColumn({ hash }) {
  const { call: callDetail } = useCallDetail(hash);

  if (!callDetail) {
    return null;
  }

  return <CallColumnImpl call={callDetail} />;
}

function PreimageColumn({ hash }) {
  const [preimage, isStatusLoaded, isBytesLoaded] = usePreimage(hash);

  if (!preimage || !isStatusLoaded || !isBytesLoaded) {
    return null;
  }

  return <CallColumnImpl call={preimage?.proposal} />;
}

function CallColumnImpl({ call }) {
  const chain = useChain();
  const [detailPopupVisible, setDetailPopupVisible] = useState(false);

  const jsonCall = call ? normalizeCall(call) : null;

  const tableViewData = convertProposalForTableView(jsonCall, chain);
  const jsonViewData = convertProposalForJsonView(jsonCall, chain);

  return (
    <RawCallProvider call={call} isLoading={false}>
      <TagWrapper className="flex items-center gap-x-1 justify-end">
        <span className="inline-flex gap-x-1">
          <ThemedTag>{call?.section}</ThemedTag>
          <ThemedTag>{call?.method}</ThemedTag>
        </span>

        <Tooltip content="Call Detail">
          <InfoDocs
            role="button"
            className={cn(
              "w-4 h-4 relative top-[0.5px]",
              "[&_path]:stroke-textTertiary [&_path]:hover:stroke-textSecondary",
              "[&_path]:fill-textTertiary [&_path]:hover:fill-textSecondary",
            )}
            onClick={() => setDetailPopupVisible(true)}
          />
        </Tooltip>
      </TagWrapper>

      {detailPopupVisible && (
        <CallDetailPopup
          jsonViewData={jsonViewData}
          tableViewData={tableViewData}
          hasTreeViewData
          setShow={setDetailPopupVisible}
        />
      )}
    </RawCallProvider>
  );
}

function ExecutionTimeColumn({ height }) {
  const { timestamp } = useBlockTimestamp(height);
  return (
    <div className="[&_span]:text14Medium [&_span]:text-textPrimary">
      <SwitchableTime timestamp={timestamp} />
    </div>
  );
}

function PeriodicColumn({ periodic, blockNumber }) {
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
