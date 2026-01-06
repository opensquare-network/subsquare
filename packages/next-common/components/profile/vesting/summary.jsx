import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { toPrecision } from "next-common/utils";
import { useProfileVestingContext } from "./context";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import NoData from "next-common/components/noData";
import Loading from "next-common/components/loading";

function ProfileVestingSummaryContent() {
  const { data } = useProfileVestingContext();
  const { decimals, symbol } = useChainSettings();
  if (!data) {
    return <NoData text="No vesting data" showIcon={false} />;
  }

  return (
    <SummaryLayout>
      <SummaryItem title="Current Balance in Lock">
        <ValueDisplay
          value={toPrecision(data.currentBalanceInLock, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem title="Total Balance by Vesting">
        <ValueDisplay
          value={toPrecision(data.totalVesting, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
      <SummaryItem title="Total Unlockable">
        <ValueDisplay
          value={toPrecision(data.unlockable, decimals)}
          symbol={symbol}
        />
      </SummaryItem>
    </SummaryLayout>
  );
}

export default function ProfileVestingSummary() {
  const { isLoading } = useProfileVestingContext();

  return (
    <SecondaryCard>
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-full">
          <Loading size={20} />
        </div>
      ) : (
        <ProfileVestingSummaryContent />
      )}
    </SecondaryCard>
  );
}
