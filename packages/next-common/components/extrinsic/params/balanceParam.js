import BigNumber from "bignumber.js";
import BalanceInput from "next-common/components/balanceInput";
import { useChainSettings } from "next-common/context/chain";
import { useCallback } from "react";

export default function BalanceParam({ value, setValue }) {
  const { symbol, decimals } = useChainSettings();
  const v = new BigNumber(value).div(Math.pow(10, decimals)).toString();
  const _setValue = useCallback(
    (v) => {
      if (v === "") {
        setValue(undefined);
        return;
      }
      setValue(
        new BigNumber(v)
          .times(Math.pow(10, decimals))
          .integerValue()
          .toString(),
      );
    },
    [setValue, decimals],
  );
  return <BalanceInput value={v} setValue={_setValue} symbol={symbol} />;
}
