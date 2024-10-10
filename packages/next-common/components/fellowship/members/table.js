import FellowshipRank from "next-common/components/fellowship/rank";
import { useNavCollapsed } from "next-common/context/nav";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import fellowshipMemberColumns from "./columns";

function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export default function FellowshipMemberTable({
  members = [],
  isAllLoaded = true,
}) {
  const isLoading = isNil(members) || !isAllLoaded;

  const rows = (members || []).map(({ address, rank }, idx) => {
    return [
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
      <AddressCol key={`address-row-${idx}`} address={address} />,
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
