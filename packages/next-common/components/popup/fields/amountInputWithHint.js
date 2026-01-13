import { noop } from "lodash-es";
import { formatBalance } from "next-common/components/assethubMigrationAssets/assetsList";
import BalanceDisplay from "next-common/components/assethubMigrationAssets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";
import Tooltip from "next-common/components/tooltip";
import BigNumber from "bignumber.js";

function MaxAmountHint({ title, value, isLoading, decimals, onClick = noop }) {
  return (
    <div className="flex gap-[8px] items-center">
      <span className="text12Medium text-textTertiary leading-none">
        {title}
      </span>
      {isLoading ? (
        <Loading size={12} />
      ) : (
        <div className="cursor-pointer" onClick={onClick}>
          <BalanceDisplay balance={formatBalance(value, decimals)} />
        </div>
      )}
    </div>
  );
}

export default function AmountInputWithHint({
  label = "Amount",
  hintLabel = "Available",
  hintTooltip = "",
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
        onClick={() => {
          if (maxAmount) {
            setInputAmount(
              BigNumber(maxAmount).div(Math.pow(10, decimals)).toString(),
            );
          }
        }}
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
