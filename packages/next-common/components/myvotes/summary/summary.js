import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import BigNumber from "bignumber.js";
import PriorInfo from "./prior";
import LoadableContent from "next-common/components/common/loadableContent";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";

function CountSummaryContent({ count }) {
  return <span>{(count || 0).toLocaleString()}</span>;
}

function TextSummaryContent({ value }) {
  return <div>{value}</div>;
}

function TokenValueContent({ value }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <TextSummaryContent
      value={
        <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />
      }
    />
  );
}

export default function ReferendaVoteSummary({
  votesLength = 0,
  totalLocked,
  prior,
  delegated,
  unLockable,
  actionComponent,
  isLoading = false,
}) {
  const { symbol, decimals } = useChainSettings();

  return (
    <SecondaryCard>
      <SummaryLayout>
        <SummaryItem title="All Votes">
          <LoadableContent isLoading={isLoading}>
            <CountSummaryContent count={votesLength} />
          </LoadableContent>
        </SummaryItem>
        <SummaryItem title="Total Locked">
          <LoadableContent isLoading={isLoading}>
            <TokenValueContent value={totalLocked} />
            <PriorInfo prior={prior} />
          </LoadableContent>
        </SummaryItem>
        {new BigNumber(delegated).gt(0) ? (
          <SummaryItem title="Delegated">
            <TokenValueContent value={delegated} />
          </SummaryItem>
        ) : null}
        <SummaryItem title="Unlockable">
          <LoadableContent isLoading={isLoading}>
            <TextSummaryContent
              value={
                <div className="flex flex-col">
                  <ValueDisplay
                    value={toPrecision(unLockable, decimals)}
                    symbol={symbol}
                  />
                  {actionComponent}
                </div>
              }
            />
          </LoadableContent>
        </SummaryItem>
      </SummaryLayout>
    </SecondaryCard>
  );
}
