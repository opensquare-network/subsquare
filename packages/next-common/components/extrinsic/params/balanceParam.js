import BigNumber from "bignumber.js";
import CurrencyInput from "next-common/components/currencyInput";
import { useChainSettings } from "next-common/context/chain";
import { useContext, useEffect, useState } from "react";
import { CallContext } from "../context";

function SimpleBalanceParam({ title, setValue }) {
  const [inputText, setInputText] = useState("");

  useEffect(
    (data) => {
      const bn = new BigNumber(inputText);

      if (bn.isNaN() || bn.isLessThan(0) || !bn.integerValue().eq(bn)) {
        setValue({
          isValid: false,
          data,
        });
        return;
      }

      setValue({
        isValid: true,
        data: bn.toFixed(),
      });
    },
    [setValue, inputText],
  );

  return (
    <>
      {title}
      <CurrencyInput value={inputText} onValueChange={setInputText} />
    </>
  );
}

function NativeTokenBalanceParam({ title, setValue }) {
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
        data: bn.times(Math.pow(10, decimals)).integerValue().toFixed(),
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

export default function BalanceParam({ title, setValue }) {
  const { section } = useContext(CallContext);

  if (["balances"].includes(section)) {
    return <NativeTokenBalanceParam title={title} setValue={setValue} />;
  }

  return <SimpleBalanceParam title={title} setValue={setValue} />;
}
