import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import useActivePoolsCount from "next-common/hooks/staking/useActivePoolsCount";
import useMinimumToJoinPool from "next-common/hooks/staking/useMinimumToJoinPool";
import useMinimumToCreatePool from "next-common/hooks/staking/useMinimumToCreatePool";
import Tooltip from "next-common/components/tooltip";
import { SystemInfo } from "@osn/icons/subsquare";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";

function SummaryTitle({ content, title }) {
  return (
    <div className="inline-flex items-center justify-start space-x-1">
      <span>{title}</span>
      <Tooltip content={content} icon={<SystemInfo width={16} height={16} />} />
    </div>
  );
}

function MinimumToCreate() {
  const { minimum, loading } = useMinimumToCreatePool();
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryItem
      title={
        <SummaryTitle
          title="Minimum To Create Pool"
          content="The minimum amount needed to bond in order to create a pool."
        />
      }
    >
      <LoadableContent isLoading={loading} size={16}>
        <ValueDisplay
          showTooltip={false}
          value={toPrecision(minimum, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    </SummaryItem>
  );
}

function MinimumToJoin() {
  const { minimum, loading } = useMinimumToJoinPool();
  const { decimals, symbol } = useChainSettings();

  return (
    <SummaryItem
      title={
        <SummaryTitle
          title="Minimum To Join Pool"
          content="The minimum amount needed to bond in order to join a pool."
        />
      }
    >
      <LoadableContent isLoading={loading} size={16}>
        <ValueDisplay
          showTooltip={false}
          value={toPrecision(minimum, decimals)}
          symbol={symbol}
        />
      </LoadableContent>
    </SummaryItem>
  );
}

function ActivePools() {
  const { activeCount, loading } = useActivePoolsCount();

  return (
    <SummaryItem
      title={
        <SummaryTitle
          title="Active Pools"
          content="The current amount of active nomination pools."
        />
      }
    >
      <LoadableContent isLoading={loading} size={16}>
        <span>{activeCount}</span>
      </LoadableContent>
    </SummaryItem>
  );
}

export default function StakingPoolsSummary() {
  return (
    <SummaryLayout>
      <ActivePools />
      <MinimumToJoin />
      <MinimumToCreate />
    </SummaryLayout>
  );
}
