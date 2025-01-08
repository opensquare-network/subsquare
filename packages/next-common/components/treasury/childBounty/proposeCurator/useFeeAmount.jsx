import { formatBalance } from "next-common/components/assets/assetsList";
import BalanceDisplay from "next-common/components/assets/balanceDisplay";
import Loading from "next-common/components/loading";
import PopupLabel from "next-common/components/popup/label";
import CurrencyInput from "next-common/components/currencyInput";
import { useCallback, useState } from "react";
import BigNumber from "bignumber.js";

function checkFeeAmount({ feeAmount, decimals, balance }) {
  if (!feeAmount) {
    throw new Error("Fee is required");
  }

  const amount = new BigNumber(feeAmount).times(Math.pow(10, decimals));
  if (amount.isNaN() || amount.lt(0) || !amount.isInteger()) {
    throw new Error("Invalid fee");
  }
  if (balance && amount.gte(balance)) {
    throw new Error("Fee should be less than the max available");
  }

  return amount.toFixed();
}

function MaxBalance({ value, isLoading, decimals, symbol }) {
  return (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary leading-none">Max</span>
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

function FeeAmount({
  balance,
  decimals,
  symbol,
  isLoading,
  address,
  feeAmount,
  setFeeAmount,
}) {
  return (
    <div>
      <PopupLabel
        text="Fee"
        status={
          !!address && (
            <MaxBalance
              value={balance}
              isLoading={isLoading}
              decimals={decimals}
              symbol={symbol}
            />
          )
        }
      />
      <CurrencyInput
        type="text"
        placeholder="0.00"
        value={feeAmount}
        onValueChange={setFeeAmount}
        symbol={symbol}
      />
    </div>
  );
}

export default function useFeeAmount(props = {}) {
  const { balance, decimals, symbol, address, isLoading } = props;

  const [feeAmount, setFeeAmount] = useState("");

  const component = (
    <FeeAmount
      balance={balance}
      decimals={decimals}
      symbol={symbol}
      isLoading={isLoading}
      address={address}
      feeAmount={feeAmount}
      setFeeAmount={setFeeAmount}
    />
  );

  const getCheckedValue = useCallback(() => {
    return checkFeeAmount({
      feeAmount,
      decimals,
      balance,
    });
  }, [feeAmount, decimals, balance]);

  return {
    value: feeAmount,
    component,
    getCheckedValue,
  };
}
