import { useEffect, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import { fetchDapData, fetchDapSupplyData } from "next-common/services/dap";

export default function useDapData() {
  const { api, checkPallet } = useContextPapi();
  const [dapState, setDapState] = useState({ isLoading: true });
  const [supplyState, setSupplyState] = useState({ isLoading: true });

  useEffect(() => {
    setDapState({ isLoading: true });
    setSupplyState({ isLoading: true });

    if (!api) {
      return;
    }

    if (!checkPallet("Balances", "TotalIssuance")) {
      setDapState({ isLoading: false });
      setSupplyState({ isLoading: false });
      return;
    }

    async function updateDapData(total, options) {
      try {
        const dapData = await fetchDapData(api, total, options);
        if (options.signal.aborted) {
          return;
        }
        setDapState({ data: dapData, isLoading: false });
      } catch (error) {
        if (options.signal.aborted) {
          return;
        }
        console.error("Failed to fetch DAP data", error);
        setDapState((state) => ({ ...state, isLoading: false }));
      }
    }

    async function updateSupplyData(total, options) {
      try {
        const supplyData = await fetchDapSupplyData(api, total, options);
        if (options.signal.aborted) {
          return;
        }
        setSupplyState({ data: supplyData, isLoading: false });
      } catch (error) {
        if (options.signal.aborted) {
          return;
        }
        console.error("Failed to fetch DAP supply data", error);
        setSupplyState((state) => ({ ...state, isLoading: false, error }));
      }
    }

    let requestController;
    const sub = api.query.Balances.TotalIssuance.watchValue().subscribe({
      next: async ({ value, block }) => {
        requestController?.abort();
        requestController = new AbortController();
        const options = { at: block.hash, signal: requestController.signal };
        await Promise.all([
          updateDapData(value, options),
          updateSupplyData(value, options),
        ]);
      },
      error: (error) => {
        requestController?.abort();
        console.error("Failed to watch DAP total issuance", error);
        setDapState((state) => ({ ...state, isLoading: false }));
        setSupplyState((state) => ({ ...state, isLoading: false, error }));
      },
    });

    return () => {
      requestController?.abort();
      sub.unsubscribe();
    };
  }, [api, checkPallet]);

  return {
    dapData: dapState.data,
    isLoading: dapState.isLoading,
    supplyData: supplyState.data,
    isSupplyLoading: supplyState.isLoading,
    supplyError: supplyState.error,
  };
}
