import { fetchTreasuryRequesting } from "next-common/services/fetchTreasuryRequesting";
import { useEffect, useMemo, useState } from "react";
import { useFiatPriceSnapshot } from "./useFiatPrice";
import getChainSettings from "next-common/utils/consts/settings";
import { toPrecision } from "next-common/utils";
import BigNumber from "bignumber.js";
import { SYMBOL_DECIMALS } from "next-common/utils/consts/asset";
import { CHAIN } from "next-common/utils/constants";
import { useChainSettings } from "next-common/context/chain";

export default function useTreasuryRequesting() {
  const { price, loading: priceLoading } = useFiatPriceSnapshot();
  const [requesting, setRequesting] = useState([]);
  const [confirming, setConfirming] = useState([]);
  const [loading, setLoading] = useState(false);
  const { modules } = useChainSettings();

  const isSupported = useMemo(() => {
    return modules?.referenda?.displayTreasuryRequesting;
  }, [modules]);

  useEffect(() => {
    if (!isSupported) {
      return;
    }

    setLoading(true);
    fetchTreasuryRequesting()
      .then((data) => {
        setConfirming(data.confirmingSpends || []);
        setRequesting(data.requestingSpends || []);
      })
      .catch((err) => {
        console.error("fetchTreasuryRequesting", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isSupported]);

  return {
    loading: loading || priceLoading,
    price,
    requesting,
    confirming,
    requestingValue: cumulativeFiatAmount(requesting, price),
    confirmingValue: cumulativeFiatAmount(confirming, price),
  };
}

export function cumulativeFiatAmount(amounts, price) {
  if (!price) {
    return new BigNumber(0);
  }

  const { symbol, decimals } = getChainSettings(CHAIN);
  const supportedSymbols = ["USDC", "USDT"];
  return amounts.reduce((acc, curr) => {
    if (curr.symbol === symbol) {
      const amount = BigNumber(toPrecision(curr.amount, decimals));
      return acc.plus(amount.multipliedBy(price));
    } else if (
      supportedSymbols.includes(curr.symbol) &&
      SYMBOL_DECIMALS[curr.symbol]
    ) {
      return acc.plus(toPrecision(curr.amount, SYMBOL_DECIMALS[curr.symbol]));
    }
    return acc;
  }, new BigNumber(0));
}
