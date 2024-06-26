import FellowshipRank from "next-common/components/fellowship/rank";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Period from "next-common/components/fellowship/params/period";
import { useNavCollapsed } from "next-common/context/nav";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import collectivesMemberColumns from "next-common/components/collectives/members/columns";

function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export default function CollectivesMemberTable({
  members = [],
  params = {},
  salaryAsset = {},
}) {
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = params ?? {};
  const { symbol, decimals } = salaryAsset;

  const rows = (members || []).map(({ address, rank }, idx) => {
    return [
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
      <AddressCol key={`address-row-${idx}`} address={address} />,
      <ValueDisplay
        key={`active-salary-${idx}`}
        value={toPrecision(activeSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${idx}`}
        value={toPrecision(passiveSalary[rank - 1] || 0, decimals)}
        symbol={symbol}
      />,
      <Period
        key={`demotion-period-${idx}`}
        blocks={demotionPeriod[rank - 1] || offboardTimeout}
      />,
      <Period
        key={`min-promotion-period-${idx}`}
        blocks={minPromotionPeriod[rank] || 0}
      />,
    ];
  });

  return (
    <DataList
      bordered
      columns={collectivesMemberColumns}
      noDataText="No Members"
      rows={rows}
      loading={isNil(members)}
    />
  );
}
