import { useReferendaDvCount } from "next-common/context/referenda/dv";
import DataList from "next-common/components/dataList";
import {
  DetailAction,
  ParticipationValue,
  StatusValue,
  TenureValue,
  W3fDelegationValue,
} from "../common/cohortValueStyled";
import { isNil } from "lodash-es";

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

export default function CohortsHistoryDesktopList({ dataRows = [] }) {
  const count = useReferendaDvCount();
  const rows = dataRows.map((row) => [
    <span key="index">{row.id}</span>,
    <TenureValue key="tenure" row={row} />,
    <span key="delegates">{row.delegateCnt}</span>,
    <W3fDelegationValue key="w3fDelegation" value={row.delegation} />,
    <ParticipationValue
      key="participation"
      voteCount={row.delegateCnt}
      totalCount={count}
    />,
    <StatusValue key="status" isEnded={!isNil(row.endIndexer)} />,
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
