import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import { toPrecision } from "next-common/utils";
import SummaryLayout from "next-common/components/summary/layout/layout";
import SummaryItem from "next-common/components/summary/layout/item";
import LoadableContent from "next-common/components/common/loadableContent";
import ValueDisplay from "next-common/components/valueDisplay";
import Tooltip from "next-common/components/tooltip";
import { useDotUsdContext } from "./context";

function EmptyValue() {
  return <span className="text-textTertiary">—</span>;
}

function AmountValue({ value, symbol, decimals }) {
  if (isNil(value)) {
    return <EmptyValue />;
  }

  return <ValueDisplay value={toPrecision(value, decimals)} symbol={symbol} />;
}

function PercentValue({ value }) {
  if (isNil(value)) {
    return <EmptyValue />;
  }

  return <span>{`${BigNumber(value).toFixed(4).replace(/\.?0+$/, "")}%`}</span>;
}

function FeeValue({ fee }) {
  if (!fee) {
    return <EmptyValue />;
  }

  if (fee.min.eq(fee.max)) {
    return <PercentValue value={fee.min} />;
  }

  return (
    <span>
      <PercentValue value={fee.min} />
      <span className="text-textTertiary"> – </span>
      <PercentValue value={fee.max} />
    </span>
  );
}

function DebtUsageBar({ ratio }) {
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
        <PercentValue value={ratio} /> of max debt
      </span>
    </div>
  );
}

export default function DotUsdSummary() {
  const { data, isLoading } = useDotUsdContext();
  const { symbol, decimals } = data?.internalAsset ?? {};

  let debtRatio = null;
  if (data?.totalDebt && Number(data?.maxDebt) > 0) {
    debtRatio = new BigNumber(data.totalDebt)
      .dividedBy(data.maxDebt)
      .multipliedBy(100);
  }

  return (
    <SummaryLayout>
      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            Total PSM debt
            <Tooltip
              content="dotUSD minted through the peg stability module, summed over all approved external assets"
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
        </LoadableContent>
      </SummaryItem>

      <SummaryItem title="Max debt">
        <LoadableContent isLoading={isLoading}>
          <AmountValue
            value={data?.maxDebt}
            symbol={symbol}
            decimals={decimals}
          />
          {!isNil(debtRatio) && <DebtUsageBar ratio={debtRatio} />}
        </LoadableContent>
      </SummaryItem>

      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            Minting fee
            <Tooltip
              content="Fee charged when minting dotUSD, per external asset"
              contentClassName="max-w-[260px]"
            />
          </span>
        }
      >
        <LoadableContent isLoading={isLoading}>
          <FeeValue fee={data?.mintingFee} />
        </LoadableContent>
      </SummaryItem>

      <SummaryItem
        title={
          <span className="inline-flex items-center gap-x-1">
            Redemption fee
            <Tooltip
              content="Fee charged when redeeming external assets, per external asset"
              contentClassName="max-w-[260px]"
            />
          </span>
        }
      >
        <LoadableContent isLoading={isLoading}>
          <FeeValue fee={data?.redemptionFee} />
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}
