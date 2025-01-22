import { formatBalance } from "next-common/components/assets/assetsList";
import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import Tooltip from "next-common/components/tooltip";

function MaxAmountHint({ title, value, isLoading, decimals, symbol }) {
  return (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary leading-none">
        {title}
      </span>
      {isLoading ? (
        <Loading size={12} />
      ) : (
        <span>
          <BalanceDisplay balance={formatBalance(value, decimals)} />
          <span className="text-textPrimary ml-1">{symbol}</span>
        </span>
      )}
    </div>
  );
}

export default function AmountInputWithHint({
  label = "Amount",
  hintLabel = "Available",
  hintTooltip = "",
  hintSymbol,
  maxAmount,
  decimals,
  symbol,
  isLoading,
  inputAmount,
  setInputAmount,
}) {
  const status = (
    <Tooltip content={hintTooltip}>
      <MaxAmountHint
        title={hintLabel}
        value={maxAmount}
        isLoading={isLoading}
        decimals={decimals}
        symbol={hintSymbol}
      />
    </Tooltip>
  );

  return (
    <div>
      <PopupLabel text={label} status={status} />
      <CurrencyInput
        type="text"
        placeholder="0.00"
        value={inputAmount}
        onValueChange={setInputAmount}
        symbol={symbol}
      />
    </div>
  );
}
