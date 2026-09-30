import { useEffect, useState } from "react";
import { useContextPapi } from "next-common/context/papi";
import { fetchDapData, fetchDapSupplyData } from "next-common/services/dap";

export default function useDapData() {
  const { api, checkPallet } = useContextPapi();
  const [dapData, setDapData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [supplyData, setSupplyData] = useState();
  const [isSupplyLoading, setIsSupplyLoading] = useState(true);
  const [supplyError, setSupplyError] = useState();

  useEffect(() => {
    setDapData(undefined);
    setIsLoading(true);
    setSupplyData(undefined);
    setIsSupplyLoading(true);
    setSupplyError(undefined);

    if (!api) {
      return;
    }

    if (!checkPallet("Balances", "TotalIssuance")) {
      setIsLoading(false);
      setIsSupplyLoading(false);
      return;
    }

    async function updateDapData(total, options) {
      try {
        const dapData = await fetchDapData(api, total, options);
        if (!options.signal.aborted) {
          setDapData(dapData);
        }
      } catch (error) {
        if (!options.signal.aborted) {
          console.error("Failed to fetch DAP data", error);
        }
      } finally {
        if (!options.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    async function updateSupplyData(total, options) {
      try {
        const supplyData = await fetchDapSupplyData(api, total, options);
        if (!options.signal.aborted) {
          setSupplyData(supplyData);
          setSupplyError(undefined);
        }
      } catch (error) {
        if (!options.signal.aborted) {
          console.error("Failed to fetch DAP supply data", error);
          setSupplyError(error);
        }
      } finally {
        if (!options.signal.aborted) {
          setIsSupplyLoading(false);
        }
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
        setSupplyError(error);
        setIsLoading(false);
        setIsSupplyLoading(false);
      },
    });

    return () => {
      requestController?.abort();
      sub.unsubscribe();
    };
  }, [api, checkPallet]);

  return { dapData, isLoading, supplyData, isSupplyLoading, supplyError };
}
