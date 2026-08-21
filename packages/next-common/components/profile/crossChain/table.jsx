import {
  ActiveTag,
  NegativeTag,
  PositiveTag,
  WarningTag,
} from "next-common/components/tags/state/styled";
import TimeAge from "next-common/components/time/timeAge";
import { useMemo, useState } from "react";
import AssetCell from "./assetCell";
import ChainAccount from "./chainAccount";

const ACTION_LABELS = {
  transfer: "Transfer",
  teleport: "Teleport",
  swap: "Swap",
  transact: "Transact",
  queryResponse: "Query Response",
};

const STATUS_LABELS = {
  sent: "Pending",
  received: "Completed",
  timeout: "Timed out",
  failed: "Failed",
};

const STATUS_TAGS = {
  received: PositiveTag,
  failed: NegativeTag,
  timeout: WarningTag,
  sent: ActiveTag,
};

const STATIC_COLUMNS = [
  {
    name: "Action",
    style: { flex: 0.7, minWidth: 0 },
    render: (journey) => ACTION_LABELS[journey?.type] || "",
  },
  {
    name: "From",
    style: { flex: 1.2, minWidth: 0 },
    render: (journey) => (
      <ChainAccount
        chain={journey?.origin}
        address={journey?.fromFormatted || journey?.from}
        xcscanUrl={getXcscanUrl(journey)}
      />
    ),
  },
  {
    name: "To",
    style: { flex: 1.2, minWidth: 0 },
    render: (journey) => (
      <ChainAccount
        chain={journey?.destination}
        address={journey?.toFormatted || journey?.to}
        xcscanUrl={getXcscanUrl(journey)}
      />
    ),
  },
  {
    name: "Assets",
    className: "text-right",
    style: { flex: 1, minWidth: 0 },
    render: (journey) => <AssetCell assets={journey?.assets} />,
  },
  {
    name: "Status",
    className: "text-right",
    style: { flex: 0.8, minWidth: 0 },
    render: (journey) => <StatusCell status={journey?.status} />,
  },
];

export function useColumnsDef() {
  const [isTime, setIsTime] = useState(false);

  return useMemo(
    () => [
      {
        name: (
          <button
            className="text-theme500"
            onClick={() => setIsTime((value) => !value)}
          >
            {isTime ? "Time" : "Age"}
          </button>
        ),
        style: { flex: 1.2, minWidth: 0 },
        render: (journey) => (
          <TimeAge
            isTime={isTime}
            time={journey?.sentAt || journey?.createdAt}
          />
        ),
      },
      ...STATIC_COLUMNS,
    ],
    [isTime],
  );
}

function getXcscanUrl(journey) {
  return journey?.correlationId
    ? `https://xcscan.io/tx/#${encodeURIComponent(journey.correlationId)}`
    : null;
}

function StatusCell({ status }) {
  const Tag = STATUS_TAGS[status];
  if (!Tag) {
    return null;
  }

  return <Tag>{STATUS_LABELS[status]}</Tag>;
}
