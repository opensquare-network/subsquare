import CurrencyInput from "next-common/components/currencyInput";
import { AccountBalanceFiatValue } from "next-common/components/overview/accountInfo/components/accountBalances";
import PopupLabelWithBalance from "next-common/components/popup/balanceLabel";
import { Skeleton } from "next-common/components/skeleton";
import { toPrecision } from "next-common/utils";
import { parseTokenAmount } from "../utils";
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

function ApproximateFiatValue({ amount, token }) {
  if (token?.type !== "native") {
    return null;
  }

  const nativeTokenAmount = parseTokenAmount(amount, token.decimals);
  if (nativeTokenAmount <= 0n) {
    return null;
  }

  return (
    <AccountBalanceFiatValue
      className="inline-flex min-w-0 text12Medium text-textTertiary"
      value={nativeTokenAmount}
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
              suffix={<ApproximateFiatValue amount={amount} token={token} />}
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
