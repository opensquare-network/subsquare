import BigNumber from "bignumber.js";
import CurrencyInput from "next-common/components/currencyInput";
import { useChainSettings } from "next-common/context/chain";
import { useEffect, useState } from "react";

export default function BalanceParam({ title, setValue }) {
  const [inputText, setInputText] = useState("");
  const { symbol, decimals } = useChainSettings();

  useEffect(
    (data) => {
      const bn = new BigNumber(inputText);

      if (bn.isNaN() || bn.isLessThan(0)) {
        setValue({
          isValid: false,
          data,
        });
        return;
      }

      setValue({
        isValid: true,
        data: bn.times(Math.pow(10, decimals)).integerValue().toString(),
      });
    },
    [setValue, decimals, inputText],
  );

  return (
    <>
      {title}
      <CurrencyInput
        value={inputText}
        onValueChange={setInputText}
        symbol={symbol}
      />
    </>
  );
}
