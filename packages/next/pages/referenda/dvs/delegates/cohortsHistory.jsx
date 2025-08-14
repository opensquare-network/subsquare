import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import DataList from "next-common/components/dataList";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import Tag from "next-common/components/tags/state/tag";
import SecondaryButton from "next-common/lib/button/secondary";
import { ArrowRight } from "@osn/icons/subsquare";
import Pagination from "next-common/components/pagination";
import { defaultPageSize } from "next-common/utils/constants";

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

export default function CohortsHistory() {
  const chainSettings = useChainSettings();
  const symbol = chainSettings.voteSymbol || chainSettings.symbol;
  const rows = [
    [
      <span key="index">1</span>,
      <span key="tenure" className="text-textTertiary">
        2025-04-15 - 2025-08-15
      </span>,
      <span key="delegates">6</span>,
      <ValueDisplay key="w3fDelegation" value={100} symbol={symbol} />,
      <ValueDisplay key="participation" value={100} />,
      <Tag key="status" state="active">
        Active
      </Tag>,
      <SecondaryButton key="action" size="icon" className="p-0 w-7 h-7">
        <ArrowRight />
      </SecondaryButton>,
    ],
  ];
  return (
    <NeutralPanel className="p-6">
      <DataList
        columns={columns}
        rows={rows}
        noDataText="No cohorts history"
        bordered={false}
      />
      <Pagination total={1} pageSize={defaultPageSize} current={1} />
    </NeutralPanel>
  );
}
