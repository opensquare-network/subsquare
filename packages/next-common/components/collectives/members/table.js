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
  FellowshipDemotionPeriodWithProgress,
  FellowshipPromotionPeriodWithProgress,
} from "next-common/components/collectives/members/periodWithProgress.jsx";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import Period from "next-common/components/fellowship/params/period";

function AddressCol({ address }) {
  const [navCollapsed] = useNavCollapsed();
  return <AddressUser maxWidth={navCollapsed ? 360 : 160} add={address} />;
}

export default function CollectivesMemberTable({ members = [] }) {
  const { params = {}, section } = useCollectivesContext();
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
    const demotionBlocks =
      rank <= 0 ? offboardTimeout : demotionPeriod[rankToIndex(rank)];

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
      section === "fellowship" ? (
        <FellowshipDemotionPeriodWithProgress
          key={`demotion-period-${idx}`}
          address={address}
          rank={rank}
          blocks={demotionBlocks}
        />
      ) : (
        <Period key={`demotion-period-${idx}`} blocks={demotionBlocks} />
      ),
      section === "fellowship" ? (
        <FellowshipPromotionPeriodWithProgress
          key={`min-promotion-period-${idx}`}
          address={address}
          rank={rank}
          blocks={minPromotionPeriod[rank] || 0}
        />
      ) : (
        <Period
          key={`min-promotion-period-${idx}`}
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
