import { usePageProps } from "next-common/context/page";
import FellowshipRank from "next-common/components/fellowship/rank";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import fellowshipCollectiveMemberColumns from "next-common/components/fellowship/collective/list/columns";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import Period from "next-common/components/fellowship/params/period";
import { isNil } from "lodash-es";
import { useNavCollapsed } from "next-common/context/nav";

function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export default function FellowshipCollectiveMembers({ members }) {
  const { fellowshipParams } = usePageProps();
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = fellowshipParams ?? {};
  const { symbol, decimals } = useSalaryAsset();

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
        blocks={minPromotionPeriod[rank - 1] || 0}
      />,
    ];
  });

  return (
    <DataList
      bordered
      columns={fellowshipCollectiveMemberColumns}
      noDataText="No Members"
      rows={rows}
      loading={isNil(members)}
    />
  );
}
