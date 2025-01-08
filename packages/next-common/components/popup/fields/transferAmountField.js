import { formatBalance } from "next-common/components/assets/assetsList";
import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";

function TransferrableBalance({ value, isLoading, decimals }) {
  return (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary leading-none">
        Transferrable
      </span>
      {isLoading ? (
        <Loading size={12} />
      ) : (
        <BalanceDisplay balance={formatBalance(value, decimals)} />
      )}
    </div>
  );
}

export default function TransferAmount({
  transferrable,
  decimals,
  symbol,
  isLoading,
  transferFromAddress,
  transferAmount,
  setTransferAmount,
}) {
  const balanceStatus = !!transferFromAddress && (
    <TransferrableBalance
      value={transferrable}
      isLoading={isLoading}
      decimals={decimals}
    />
  );

  return (
    <div>
      <PopupLabel text="Amount" status={balanceStatus} />
      <CurrencyInput
        type="text"
        placeholder="0.00"
        value={transferAmount}
        onValueChange={setTransferAmount}
        symbol={symbol}
      />
    </div>
  );
}
