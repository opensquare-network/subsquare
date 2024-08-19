import FellowshipRank from "next-common/components/fellowship/rank";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useNavCollapsed } from "next-common/context/nav";
import AddressUser from "next-common/components/user/addressUser";
import DataList from "next-common/components/dataList";
import { isNil } from "lodash-es";
import collectivesMemberColumns from "next-common/components/collectives/members/columns";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import { getRankSalary } from "next-common/utils/fellowship/getRankSalary";
import {
  DemotionPeriodWithProgress,
  PromotionPeriodWithProgress,
} from "next-common/components/collectives/members/periodWithProgress.jsx";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";

function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export default function CollectivesMemberTable({ members = [], params = {} }) {
  const {
    activeSalary = [],
    passiveSalary = [],
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = params ?? {};
  const { symbol, decimals } = useSalaryAsset();

  const isLoading = isNil(members);

  const rows = (members || []).map(({ address, rank }, idx) => {
    return [
      <FellowshipRank key={`rank-row-${idx}`} rank={rank} />,
      <AddressCol key={`address-row-${idx}`} address={address} />,
      <ValueDisplay
        key={`active-salary-${idx}`}
        value={toPrecision(getRankSalary(activeSalary, rank), decimals)}
        symbol={symbol}
      />,
      <ValueDisplay
        key={`passive-salary-${idx}`}
        value={toPrecision(getRankSalary(passiveSalary, rank), decimals)}
        symbol={symbol}
      />,

      <DemotionPeriodWithProgress
        keyPrefix={`demotion-period-${idx}`}
        periodKey={rankToIndex(rank)}
        address={address}
        params={params}
        rank={rank}
        blocks={demotionPeriod[rankToIndex(rank)] || offboardTimeout}
      />,
      minPromotionPeriod[rank] > 0 && (
        <PromotionPeriodWithProgress
          keyPrefix={`promotion-period-${idx}`}
          periodKey={rank}
          address={address}
          params={params}
          rank={rank}
          blocks={minPromotionPeriod[rank] || 0}
        />
      ),
    ];
  });

  return (
    <DataList
      bordered
      columns={collectivesMemberColumns}
      noDataText="No Members"
      rows={rows}
      loading={isLoading}
    />
  );
}
