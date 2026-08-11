import BigNumber from "bignumber.js";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { DetailRow } from "next-common/components/overview/centrifugeStats/detailRow";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import { TitleContainer } from "next-common/components/styled/containers/titleContainer";
import ValueDisplay from "next-common/components/valueDisplay";
import { cn, toPrecision } from "next-common/utils";
import { useSwap } from "../context/swap";
import { getLpFeeUnit } from "../amm";
import {
  PRICE_IMPACT_HIGH_THRESHOLD,
  PRICE_IMPACT_WARNING_THRESHOLD,
} from "../constants";
import { formatPercent, formatTokenAmount } from "../utils";
import TokenIcon from "./tokenIcon";

function SectionCard({ title, children }) {
  return (
    <SecondaryCardDetail>
      <TitleContainer className="mb-4 px-0">{title}</TitleContainer>
      {children}
    </SecondaryCardDetail>
  );
}

function ReserveValue({ token, reserve }) {
  if (isNil(reserve) || !token) {
    return "-";
  }
  return <ValueDisplay value={toPrecision(reserve, token.decimals)} />;
}

function ReserveRow({ token, reserve, isLoading }) {
  return (
    <DetailRow
      title={
        <LoadableContent isLoading={isLoading && !token} size={20}>
          {token ? (
            <span className="inline-flex items-center gap-x-2">
              <TokenIcon className="h-5 w-5" token={token} />
              <span>{token.symbol}</span>
            </span>
          ) : (
            "-"
          )}
        </LoadableContent>
      }
      value={
        <LoadableContent isLoading={isLoading} size={20}>
          <ReserveValue token={token} reserve={reserve} />
        </LoadableContent>
      }
    />
  );
}

function PoolReserves() {
  const { pools, quote } = useSwap();
  const { tokenIn, tokenOut } = pools;
  const reserves = quote.reserves;
  const isLoading = pools.loading || quote.loading;

  return (
    <SectionCard title="Pool reserves">
      <div className="space-y-2">
        <ReserveRow
          token={tokenIn}
          reserve={reserves?.reserveIn}
          isLoading={isLoading}
        />
        <ReserveRow
          token={tokenOut}
          reserve={reserves?.reserveOut}
          isLoading={isLoading}
        />
      </div>
    </SectionCard>
  );
}

function TokenAmount({ amount, symbol }) {
  return (
    <span className="inline-flex items-center gap-x-1">
      {amount}
      <span className="text-textTertiary">{symbol}</span>
    </span>
  );
}

function ReferenceRateValue({ isLoading, tokenIn, tokenOut, unitRate }) {
  return (
    <LoadableContent isLoading={isLoading} size={20}>
      {!isNil(unitRate) && tokenIn && tokenOut ? (
        <span className="inline-flex items-center gap-x-1">
          <span>1</span>
          <span className="text-textTertiary">{tokenIn.symbol}</span>
          <span>=</span>
          <TokenAmount
            amount={formatTokenAmount(unitRate, tokenOut.decimals)}
            symbol={tokenOut.symbol}
          />
        </span>
      ) : (
        "-"
      )}
    </LoadableContent>
  );
}

function OutputAmountValue({ amount, isLoading, tokenOut }) {
  return (
    <LoadableContent isLoading={isLoading} size={20}>
      {!isNil(amount) && tokenOut ? (
        <TokenAmount
          amount={formatTokenAmount(amount, tokenOut.decimals)}
          symbol={tokenOut.symbol}
        />
      ) : (
        "-"
      )}
    </LoadableContent>
  );
}

function PriceImpactValue({ isLoading, priceImpact }) {
  return (
    <LoadableContent isLoading={isLoading} size={20}>
      {!isNil(priceImpact) ? (
        <span
          className={cn(
            priceImpact < PRICE_IMPACT_WARNING_THRESHOLD && "text-orange500",
            priceImpact <= PRICE_IMPACT_HIGH_THRESHOLD && "text-red500",
          )}
        >
          {formatPercent(priceImpact)}
        </span>
      ) : (
        "-"
      )}
    </LoadableContent>
  );
}

function getLpFeePercentage(lpFee) {
  return `${BigNumber(`${lpFee}`)
    .div(`${getLpFeeUnit(lpFee)}`)
    .times(100)
    .toFixed(2)}%`;
}

function LpFeeContent({ lpFee, lpFeeAmount, tokenIn }) {
  if (isNil(lpFee)) {
    return "-";
  }

  if (isNil(lpFeeAmount) || !tokenIn) {
    return getLpFeePercentage(lpFee);
  }

  return (
    <span className="inline-flex items-center gap-x-1">
      <TokenAmount
        amount={formatTokenAmount(lpFeeAmount, tokenIn.decimals)}
        symbol={tokenIn.symbol}
      />
      <span className="text-textTertiary">({getLpFeePercentage(lpFee)})</span>
    </span>
  );
}

function LpFeeValue({ isLoading, lpFee, lpFeeAmount, tokenIn }) {
  return (
    <LoadableContent isLoading={isLoading} size={20}>
      <LpFeeContent lpFee={lpFee} lpFeeAmount={lpFeeAmount} tokenIn={tokenIn} />
    </LoadableContent>
  );
}

function SwapSummary() {
  const { minimumReceived, pools, priceImpact, quote } = useSwap();
  const { tokenIn, tokenOut } = pools;
  const { loading, lpFee, lpFeeAmount, unitRate } = quote;
  const isQuoteLoading = pools.loading || loading;

  return (
    <SectionCard title="Swap details">
      <div className="space-y-2">
        <DetailRow
          title="Rate"
          value={
            <ReferenceRateValue
              isLoading={isQuoteLoading}
              tokenIn={tokenIn}
              tokenOut={tokenOut}
              unitRate={unitRate}
            />
          }
        />
        <DetailRow
          title="Min. received"
          value={
            <OutputAmountValue
              amount={minimumReceived}
              isLoading={isQuoteLoading}
              tokenOut={tokenOut}
            />
          }
        />
        <DetailRow
          title="Price impact"
          value={
            <PriceImpactValue
              isLoading={isQuoteLoading}
              priceImpact={priceImpact}
            />
          }
        />
        <DetailRow
          title="LP fee"
          value={
            <LpFeeValue
              isLoading={isQuoteLoading || isNil(lpFee)}
              lpFee={lpFee}
              lpFeeAmount={lpFeeAmount}
              tokenIn={tokenIn}
            />
          }
        />
      </div>
    </SectionCard>
  );
}

export default function SwapDetails() {
  return (
    <aside className="space-y-4">
      <SwapSummary />
      <PoolReserves />
    </aside>
  );
}
