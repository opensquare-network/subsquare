import { formatBalance } from "next-common/components/assethubMigrationAssets/assetsList";
import BalanceDisplay from "next-common/components/assethubMigrationAssets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "../label";
import CurrencyInput from "next-common/components/currencyInput";

export function TransferrableBalance({ value, isLoading, decimals }) {
  return (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text14Medium text-textTertiary leading-none">
        Transferrable
      </span>
      {isLoading ? (
        <Loading size={12} />
      ) : isNaN(value) ? (
        <span className="text-textTertiary">--</span>
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
  transferAmount,
  setTransferAmount,
  showBalance = true,
}) {
  const balanceStatus = showBalance && (
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
