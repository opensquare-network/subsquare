import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { useBondedPools } from "./hooks/useBondedPools";
import PoolsTableList from "./table";
import ListTitleBar from "next-common/components/listTitleBar";
import {
  StakingFilter,
  StakingFilterProvider,
  useFilteredPools,
} from "../filter";

function PoolsImpl() {
  const { pools, loading } = useBondedPools();
  const filteredPools = useFilteredPools(pools);
  const count = filteredPools?.length || 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <ListTitleBar
          className={"max-md:-ml-6"}
          title="List"
          titleCount={count}
        />
        <StakingFilter />
      </div>
      <SecondaryCard>
        <PoolsTableList list={filteredPools} loading={loading} />
      </SecondaryCard>
    </div>
  );
}

export default function Pools() {
  return (
    <StakingFilterProvider>
      <PoolsImpl />
    </StakingFilterProvider>
  );
}
