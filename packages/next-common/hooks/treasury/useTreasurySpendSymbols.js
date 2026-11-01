import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export default function useTreasurySpendSymbols() {
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSymbols() {
      const { result } = await nextApi.fetch("treasury/spends/symbols");
      if (!cancelled) {
        setSymbols(result?.symbols || []);
        setLoading(false);
      }
    }

    fetchSymbols();

    return () => {
      cancelled = true;
    };
  }, []);

  return { symbols, loading };
}
