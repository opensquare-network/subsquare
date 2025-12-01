import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useBondedPools, useSortedPools } from "./hooks/useBondedPools";
import PoolsTableList from "./table";
import ListTitleBar from "next-common/components/listTitleBar";
import {
  StakingFilter,
  StakingFilterProvider,
  useFilteredPools,
} from "./filter";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import ListLayout from "next-common/components/layout/ListLayout";
import StakingPoolsSummary from "./summary";
import { MyPoolProvider, useMyPool } from "next-common/context/staking/myPool";
import usePoolsColumns from "./hooks/usePoolsColumns";
import useColumns from "next-common/components/styledList/useColumns";

const PAGE_SIZE = 50;

function PoolsImpl() {
  const { poolMember } = useMyPool();
  const { pools, loading } = useBondedPools();
  const filteredPools = useFilteredPools(pools);

  const columnsData = usePoolsColumns();
  const { sortedColumn, sortDirection, columns } = useColumns(
    columnsData,
    "Members",
    true,
  );

  const sortedPools = useSortedPools({
    pools: filteredPools,
    myPoolId: poolMember?.poolId,
    sortedColumn,
    sortDirection,
  });
  const count = sortedPools?.length || 0;

  const { pagedItems: pagedPools, component: pagination } = useListPagination(
    sortedPools,
    PAGE_SIZE,
    {
      buttonMode: true,
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mr-6">
        <ListTitleBar title="List" titleCount={count} />
        <StakingFilter />
      </div>
      <SecondaryCard className="!pl-0">
        <PoolsTableList list={pagedPools} loading={loading} columns={columns} />
        {pagination}
      </SecondaryCard>
    </div>
  );
}

function PoolsContentImpl() {
  return (
    <ListLayout
      title={"Nomination Pools"}
      seoInfo={{ title: "" }}
      description={
        "Displays and manages nomination pools, allowing users to view, join, and track their staking pools."
      }
      summary={<StakingPoolsSummary />}
    >
      <StakingFilterProvider>
        <PoolsImpl />
      </StakingFilterProvider>
    </ListLayout>
  );
}

export default function PoolsContent() {
  return (
    <MyPoolProvider>
      <PoolsContentImpl />
    </MyPoolProvider>
  );
}
