import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import { toPrecision } from "next-common/utils";
import useApiProperties from "next-common/hooks/useApiProperties";
import { Skeleton } from "next-common/components/skeleton";

export default function ExistentialDeposit({
  destApi,
  title,
  value: valueOverride,
  symbol: symbolOverride,
  decimals: decimalsOverride,
}) {
  const { symbol, decimals, isLoading } = useApiProperties(destApi);
  const loading = isLoading || !destApi;

  // Allow callers to override the deposit value/symbol/decimals when the
  // destination asset is not the chain's native token (e.g. DOT on HydraDX,
  // where DOT is a foreign asset with its own decimals, and the relevant
  // deposit is the assetRegistry's per-asset value, not the native HDX one).
  const value =
    (valueOverride ?? destApi?.consts.balances?.existentialDeposit) || 0;
  const displaySymbol = symbolOverride || symbol;
  const displayDecimals = decimalsOverride ?? decimals;

  return (
    <div>
      <PopupLabel text={title || "Destination Existential Deposit"} />
      {loading ? (
        <Skeleton className="h-[40px]" />
      ) : (
        <CurrencyInput
          disabled
          value={toPrecision(value, displayDecimals)}
          symbol={displaySymbol}
        />
      )}
    </div>
  );
}
