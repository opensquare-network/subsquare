import FellowshipRank from "next-common/components/fellowship/rank";
import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import fellowshipMemberColumns from "./columns";
import { AddressCol } from "next-common/components/collectives/members/table";

export default function FellowshipMemberTable({ members = [] }) {
  const isLoading = isNil(members);

  const rows = (members || []).map(({ address, rank }, idx) => {
    return [
      <AddressCol key={`address-row-${idx}`} address={address} />,
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
    ];
  });

  return (
    <DataList
      bordered
      columns={fellowshipMemberColumns}
      noDataText="No Members"
      rows={rows}
      loading={isLoading}
    />
  );
}
