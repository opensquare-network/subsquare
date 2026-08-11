import CurrencyInput from "next-common/components/currencyInput";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { Skeleton } from "next-common/components/skeleton";
import { toPrecision } from "next-common/utils";
import TokenPicker from "./tokenPicker";

function BalanceLabel({ balance, label, loading, token }) {
  return (
    <PopupLabelWithBalance
      text={label}
      balanceName="Balance"
      isLoading={loading}
      balance={toPrecision(balance ?? 0, token?.decimals ?? 0)}
      symbol={token?.symbol}
    />
  );
}

export default function SwapField({
  amount,
  balance,
  balanceLoading,
  children,
  label,
  onAmountChange,
  onTokenChange,
  poolsLoading = false,
  readOnly = false,
  token,
  tokens,
}) {
  return (
    <div>
      <BalanceLabel
        balance={balance}
        label={label}
        loading={poolsLoading || balanceLoading}
        token={token}
      />
      {poolsLoading ? (
        <div className="flex items-stretch gap-2">
          <Skeleton className="flex-1 h-10" />
          <Skeleton className="w-24 h-10" />
        </div>
      ) : (
        <div className="flex items-stretch gap-2">
          <div className="flex-1 min-w-0">
            <CurrencyInput
              placeholder="0.00"
              readOnly={readOnly}
              value={amount}
              onValueChange={onAmountChange}
            />
          </div>
          <TokenPicker onChange={onTokenChange} token={token} tokens={tokens} />
        </div>
      )}
      {children}
    </div>
  );
}
