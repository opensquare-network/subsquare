import BigNumber from "bignumber.js";
import BalanceInput from "next-common/components/balanceInput";
import { useChainSettings } from "next-common/context/chain";
import { useEffect, useState } from "react";

export default function BalanceParam({ setValue }) {
  const [inputBalance, setInputBalance] = useState("");
  const { symbol, decimals } = useChainSettings();

  useEffect(() => {
    if (inputBalance === "") {
      setValue(undefined);
      return;
    }
    setValue(
      new BigNumber(inputBalance)
        .times(Math.pow(10, decimals))
        .integerValue()
        .toString(),
    );
  }, [setValue, decimals, inputBalance]);

  return (
    <BalanceInput
      value={inputBalance}
      setValue={setInputBalance}
      symbol={symbol}
    />
  );
}
