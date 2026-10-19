import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export default function useTreasurySpendSymbols() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchSymbols() {
      const { result } = await nextApi.fetch("treasury/spends/symbols");
      if (!cancelled) {
        setSymbols(result?.symbols || []);
      }
    }

    fetchSymbols();

    return () => {
      cancelled = true;
    };
  }, []);

  return symbols;
}
