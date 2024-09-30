import { formatBalance } from "next-common/components/assets/assetsList";
import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "../label";
import Input from "next-common/components/input";
import Tooltip from "next-common/components/tooltip";

function MaxAmountHint({ title, value, isLoading, decimals }) {
  return (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary leading-none">
        {title}
      </span>
      {isLoading ? (
        <Loading size={12} />
      ) : (
        <BalanceDisplay balance={formatBalance(value, decimals)} />
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
      />
    </Tooltip>
  );

  return (
    <div>
      <PopupLabel text={label} status={status} />
      <Input
        type="text"
        placeholder="0.00"
        value={inputAmount}
        onChange={(e) => setInputAmount(e.target.value.replace("。", "."))}
        symbol={symbol}
      />
    </div>
  );
}
