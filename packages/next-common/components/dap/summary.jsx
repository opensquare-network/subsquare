import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import ExternalLink from "next-common/components/externalLink";
import { useDapContext } from "./context";

function TotalSupplyTooltip() {
  return (
    <Tooltip
      content={
        <>
          Total issued DOT, including active and inactive supply.
          <ExternalLink
            className="underline ml-1"
            href="https://wiki.polkadot.com/learn/learn-dot/#total-supply"
          >
            wiki
          </ExternalLink>
        </>
      }
      contentClassName="max-w-[280px]"
    />
  );
}

function SupplyValue({ value }) {
  const { decimals, symbol } = useChainSettings();
  if (isNil(value)) {
    return <span className="text-textTertiary">—</span>;
  }
  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function DapFundsBreakdown({ buffer, pending }) {
  return (
    <div className="text12Medium text-textTertiary mt-1 flex flex-col gap-y-1">
      <span className="inline-flex items-center gap-x-1">
        Buffer <SupplyValue value={buffer} />
      </span>
      <span className="inline-flex items-center gap-x-1">
        Pending <SupplyValue value={pending} />
      </span>
    </div>
  );
}

export default function DapSummary() {
  const { dapData, isLoading } = useDapContext();

  return (
    <SummaryLayout>
      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            Total supply
            <TotalSupplyTooltip />
          </span>
        }
      >
        <LoadableContent isLoading={isLoading && !dapData}>
          <SupplyValue value={dapData?.totalSupply} />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Active supply">
        <LoadableContent isLoading={isLoading && !dapData}>
          <SupplyValue value={dapData?.activeSupply} />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Inactive supply">
        <LoadableContent isLoading={isLoading && !dapData}>
          <SupplyValue value={dapData?.inactiveSupply} />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="DAP funds">
        <LoadableContent isLoading={isLoading && !dapData}>
          <SupplyValue value={dapData?.funds} />
        </LoadableContent>
        {dapData && (
          <DapFundsBreakdown
            buffer={dapData.buffer}
            pending={dapData.pending}
          />
        )}
      </SummaryItem>
    </SummaryLayout>
  );
}
