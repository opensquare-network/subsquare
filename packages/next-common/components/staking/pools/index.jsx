import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useBondedPools } from "./hooks/useBondedPools";
import PoolsTableList from "./table";
import ListTitleBar from "next-common/components/listTitleBar";
import {
  StakingFilter,
  StakingFilterProvider,
  useFilteredPools,
} from "../filter";
import { useListPagination } from "next-common/components/pagination/usePaginationComponent";
import ListLayout from "next-common/components/layout/ListLayout";
import PoolsSummary from "./summary";
import useMyPool from "./hooks/useMyPool";

const PAGE_SIZE = 50;

function PoolsImpl() {
  const { pools, loading } = useBondedPools();
  const filteredPools = useFilteredPools(pools);
  const count = filteredPools?.length || 0;

  const { pagedItems: pagedPools, component: pagination } = useListPagination(
    filteredPools,
    PAGE_SIZE,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <ListTitleBar
          className={"max-md:-ml-6 mr-6"}
          title="List"
          titleCount={count}
        />
        <StakingFilter />
      </div>
      <SecondaryCard>
        <PoolsTableList list={pagedPools} loading={loading} />
        {pagination}
      </SecondaryCard>
    </div>
  );
}

export default function PoolsContent() {
  const { result: myPool } = useMyPool(true);

  return (
    <ListLayout
      title={"Nomination Pools"}
      seoInfo={{ title: "" }}
      description={
        "Displays and manages nomination pools, allowing users to view, join, and track their staking pools."
      }
      summary={myPool && <PoolsSummary myPool={myPool} />}
    >
      <StakingFilterProvider>
        <PoolsImpl />
      </StakingFilterProvider>
    </ListLayout>
  );
}
