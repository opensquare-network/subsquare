import { colors } from "next-common/components/treasury/projects/const";
import { useChainSettings } from "next-common/context/chain";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { AddressUser } from "next-common/components/user";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import Loading from "next-common/components/loading";
import { useDapContext } from "./context";
import DapAllocationChart from "./allocationChart";

function Content() {
  const { dapData, isLoading } = useDapContext();
  const { decimals, symbol } = useChainSettings();
  const allocations = dapData?.allocations ?? [];

  if (isLoading && !dapData) {
    return (
      <div className="flex justify-center py-12">
        <Loading size={24} />
      </div>
    );
  }

  if (allocations.length === 0) {
    return (
      <div className="text14Medium text-textTertiary py-8 text-center">
        No budget allocation available.
      </div>
    );
  }

  return (
    <div className="flex items-center gap-10 max-md:flex-col">
      <DapAllocationChart allocations={allocations} />
      <div className="flex-1 w-full min-w-0 space-y-6">
        {allocations.map((item, index) => (
          <div
            key={item.id}
            className="grid grid-cols-[minmax(0,1fr)_140px_120px] items-center gap-x-4 gap-y-2 max-sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div className="flex items-center gap-3 min-w-0 max-sm:col-span-2">
              <span
                className="w-3 h-3 shrink-0 rounded-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text14Medium text-textPrimary">{item.name}</span>
              <span className="text14Medium text-textTertiary">
                {item.percentage}%
              </span>
            </div>
            <div className="max-sm:pl-6">
              <AddressUser add={item.address} />
            </div>
            <div className="text14Medium text-textPrimary text-right whitespace-nowrap">
              <ValueDisplay
                value={toPrecision(item.balance, decimals)}
                symbol={symbol}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DapAllocation() {
  return (
    <SecondaryCard>
      <h4 className="text16Bold text-textPrimary mb-6">
        Current budget allocation
      </h4>
      <Content />
    </SecondaryCard>
  );
}
