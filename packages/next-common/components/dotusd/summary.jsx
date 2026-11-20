import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import { abbreviateBigNumber } from "next-common/utils/viewfuncs";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import { useDotUsdContext } from "./context";
import usePsmStats from "./usePsmStats";
import RecordsLink from "./recordsLink";

function EmptyValue() {
  return <span className="text-textTertiary">—</span>;
}

function AmountValue({ value, symbol, decimals }) {
  if (isNil(value) || isNil(decimals)) {
    return <EmptyValue />;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function PercentValue({ value }) {
  if (isNil(value)) {
    return <EmptyValue />;
  }

  return (
    <span>{`${BigNumber(value)
      .toFixed(4)
      .replace(/\.?0+$/, "")}%`}</span>
  );
}

// The net flow keeps its direction visible, so an outflow is not read as an inflow.
function SignedAmountValue({ value, symbol, decimals }) {
  if (isNil(value) || isNil(decimals)) {
    return <EmptyValue />;
  }

  const amount = BigNumber(value);
  const sign = amount.isZero() ? "" : amount.isPositive() ? "+" : "−";

  return (
    <div className="inline-flex items-center gap-x-1">
      {sign && <span>{sign}</span>}
      <AmountValue
        value={amount.abs().toString()}
        symbol={symbol}
        decimals={decimals}
      />
    </div>
  );
}

function DebtUsageBar({ ratio, maxDebt }) {
  const percent = BigNumber.min(BigNumber.max(ratio, 0), 100).toNumber();

  return (
    <div className="mt-2 flex flex-col gap-y-1">
      <div className="h-1 w-full rounded-full bg-neutral300">
        <div
          className="h-full rounded-full bg-theme500"
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text12Medium text-textTertiary">
        <PercentValue value={ratio} /> of max <b>{maxDebt}</b> debt
      </span>
    </div>
  );
}

export default function DotUsdSummary() {
  const { data, isLoading } = useDotUsdContext();
  const { stats, isLoading: isStatsLoading } = usePsmStats();
  const { symbol, decimals } = data?.internalAsset ?? {};

  let debtRatio = null;
  if (data?.totalDebt && Number(data?.maxDebt) > 0) {
    debtRatio = new BigNumber(data.totalDebt)
      .dividedBy(data.maxDebt)
      .multipliedBy(100);
  }

  const maxDebt = isNil(data?.maxDebt)
    ? null
    : abbreviateBigNumber(toPrecision(data.maxDebt, decimals));

  // The flows come from the backend and their unit from the chain: hold the values in the
  // loading state until both sources are in, so no dash flashes before the data.
  const isFlowLoading = isStatsLoading || isLoading;

  return (
    <SummaryLayout>
      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            Total PSM debt
            <Tooltip
              content="dotUSD minted through the peg stability module, summed over all approved external assets, against the most the instance may mint"
              contentClassName="max-w-[260px]"
            />
          </span>
        }
      >
        <LoadableContent isLoading={isLoading}>
          <AmountValue
            value={data?.totalDebt}
            symbol={symbol}
            decimals={decimals}
          />
          {!isNil(debtRatio) && (
            <DebtUsageBar ratio={debtRatio} maxDebt={maxDebt} />
          )}
        </LoadableContent>
      </SummaryItem>

      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            24h net minted
            <RecordsLink tab="mint" tooltip="View mint records" />
          </span>
        }
      >
        <LoadableContent isLoading={isFlowLoading}>
          <AmountValue
            value={stats?.minted?.amount}
            symbol={symbol}
            decimals={decimals}
          />
        </LoadableContent>
      </SummaryItem>

      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            24h net redeemed
            <RecordsLink tab="redeem" tooltip="View redeem records" />
          </span>
        }
      >
        <LoadableContent isLoading={isFlowLoading}>
          <AmountValue
            value={stats?.redeemed?.amount}
            symbol={symbol}
            decimals={decimals}
          />
        </LoadableContent>
      </SummaryItem>

      <SummaryItem title="24h net">
        <LoadableContent isLoading={isFlowLoading}>
          <SignedAmountValue
            value={stats?.net}
            symbol={symbol}
            decimals={decimals}
          />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
