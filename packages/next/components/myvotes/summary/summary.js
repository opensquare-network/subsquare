import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Summary from "next-common/components/summary";
import BigNumber from "bignumber.js";
import PriorInfo from "./prior";
import LoadableContent from "next-common/components/common/loadableContent";

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

  const items = [
    {
      title: "All Votes",
      content: (
        <LoadableContent isLoading={isLoading}>
          <CountSummaryContent count={votesLength} />
        </LoadableContent>
      ),
    },
    {
      title: "Total Locked",
      content: (
        <LoadableContent isLoading={isLoading}>
          <TokenValueContent value={totalLocked} />
          <PriorInfo prior={prior} />
        </LoadableContent>
      ),
    },
    new BigNumber(delegated).gt(0)
      ? {
          title: "Delegated",
          content: <TokenValueContent value={delegated} />,
        }
      : null,
    {
      title: "Unlockable",
      content: (
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
      ),
    },
  ].filter(Boolean);

  return (
    <SecondaryCard>
      <Summary items={items} />
    </SecondaryCard>
  );
}
