import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import Pagination from "next-common/components/pagination";
import { defaultPageSize } from "next-common/utils/constants";
import WindowSizeProvider from "next-common/context/windowSize";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import Descriptions from "next-common/components/Descriptions";
import { usePageProps } from "next-common/context/page";
import dayjs from "dayjs";
import Divider from "next-common/components/styled/layout/divider";
import DataList from "next-common/components/dataList";
import {
  DetailAction,
  ParticipationValue,
  StatusValue,
  TenureValue,
  TimeValue,
  W3fDelegationValue,
} from "../common/cohortValueStyled";

const columns = [
  {
    name: "Index",
    style: { width: 80, textAlign: "left" },
  },
  {
    name: "Tenure",
  },
  {
    name: "Delegates",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "W3F Delegation",
    style: { width: 160, textAlign: "right" },
  },
  {
    name: "Participation",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "Status",
    style: { width: 120, textAlign: "right" },
  },
  {
    name: "",
    style: { width: 80, textAlign: "right" },
  },
];

export function CohortsHistoryImpl({ dataRows = [] }) {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <MobileList />;
  }

  return <DesktopList dataRows={dataRows} />;
}

export default function CohortsHistory() {
  const { cohorts = [] } = usePageProps();

  return (
    <WindowSizeProvider>
      <NeutralPanel className="p-6">
        <CohortsHistoryImpl dataRows={cohorts} />
        <Pagination total={1} pageSize={defaultPageSize} current={1} />
      </NeutralPanel>
    </WindowSizeProvider>
  );
}

function DesktopList({ dataRows = [] }) {
  const rows = dataRows.map((row) => [
    <span key="index">{row.id}</span>,
    <TenureValue key="tenure" row={row} />,
    <span key="delegates">{row.delegateCnt}</span>,
    <W3fDelegationValue key="w3fDelegation" row={row} />,
    <ParticipationValue
      key="participation"
      value={row.dvTrackReferendaCnt / row.delegateCnt}
    />,
    <StatusValue key="status" row={row} />,
    <DetailAction key="action" row={row} />,
  ]);
  return (
    <DataList
      columns={columns}
      rows={rows}
      noDataText="No cohorts history"
      bordered={false}
    />
  );
}

function MobileList() {
  const { cohorts = [] } = usePageProps();
  const rows = cohorts.map((row) => {
    return (
      <div key={row.id}>
        <div className="mb-3">
          <div className="flex grow items-center justify-between">
            {row.id}
            <DetailAction row={row} />
          </div>
        </div>

        <Descriptions
          bordered={false}
          className="[&_.descriptions-item-label]:text-textTertiary [&_.descriptions-item]:h-auto [&_.descriptions-item]:my-2"
          items={[
            {
              label: "Start Time",
              value: (
                <TimeValue
                  time={dayjs(row.startIndexer?.blockTime).format(
                    "YYYY-MM-DD HH:mm:ss",
                  )}
                  blockNumber={row.startIndexer?.blockHeight}
                />
              ),
              className: "items-start",
            },
            row.endIndexer
              ? {
                  label: "End Time",
                  value: (
                    <TimeValue
                      time={dayjs(row.endIndexer?.blockTime).format(
                        "YYYY-MM-DD HH:mm:ss",
                      )}
                      blockNumber={row.endIndexer?.blockHeight}
                    />
                  ),
                  className: "items-start",
                }
              : null,
            {
              label: "Delegates",
              value: row.delegateCnt,
            },
            {
              label: "W3F Delegation",
              value: <W3fDelegationValue row={row} />,
            },
            {
              label: "Participation",
              value: (
                <ParticipationValue
                  value={row.dvTrackReferendaCnt / row.delegateCnt}
                />
              ),
            },
            {
              label: "Status",
              value: <StatusValue row={row} />,
            },
          ].filter(Boolean)}
        />
        <Divider className="my-3" />
      </div>
    );
  });

  return rows;
}
