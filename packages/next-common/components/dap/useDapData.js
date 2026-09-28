import { useEffect, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import { fetchDapData } from "next-common/services/dap";

export default function useDapData() {
  const { api, checkPallet } = useContextPapi();
  const [dapData, setDapData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setDapData(undefined);
    setIsLoading(true);

    if (!api) {
      return;
    }

    if (!checkPallet("Balances", "TotalIssuance")) {
      setIsLoading(false);
      return;
    }

    function handleError(error) {
      console.error("Failed to fetch DAP data", error);
      setIsLoading(false);
    }

    const sub = api.query.Balances.TotalIssuance.watchValue().subscribe({
      next: async ({ value, block }) => {
        try {
          const dapData = await fetchDapData(api, value, {
            at: block.hash,
          });
          setDapData(dapData);
          setIsLoading(false);
        } catch (error) {
          handleError(error);
        }
      },
      error: handleError,
    });

    return () => {
      sub.unsubscribe();
    };
  }, [api, checkPallet]);

  return { dapData, isLoading };
}
