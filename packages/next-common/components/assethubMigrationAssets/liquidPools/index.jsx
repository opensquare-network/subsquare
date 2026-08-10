import LiquidPoolsTable from "./table";
import { liquidPoolsColumnsDef } from "./table/columns";
import useLiquidPools from "./useLiquidPools";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";

export default function LiquidPools() {
  const { data, loading, count } = useLiquidPools();

  return (
    <div className="flex flex-col gap-4">
      <TitleContainer className="justify-start gap-x-1">
        Liquidity Pools
        {loading ? null : (
          <span className="text16Medium text-textTertiary">{count}</span>
        )}
      </TitleContainer>
      <SecondaryCard>
        <LiquidPoolsTable
          pools={data}
          loading={loading}
          columnsDef={liquidPoolsColumnsDef}
        />
      </SecondaryCard>
    </div>
  );
}
