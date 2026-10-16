import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import nextApi from "next-common/services/nextApi";
import { defaultPageSize } from "next-common/utils/constants";

/**
 * One page of the swaps of the dotUSD PSM, newest first. The block scan of Asset Hub indexes
 * the `psm.Minted` and `psm.Redeemed` events into the psmEvent collection, and the backend
 * serves a method at a time together with the total, which is what lets the pager name a page.
 */
export default function useSwaps(method, page, pageSize = defaultPageSize) {
  const [state, setState] = useState({
    swaps: [],
    total: 0,
    // The page the data on screen came from, which lags the requested one while loading.
    page: 1,
    isLoading: true,
  });

  useEffect(() => {
    if (isNil(method)) {
      setState({ swaps: [], total: 0, page: 1, isLoading: false });
      return;
    }

    let isMounted = true;
    // Keep the total of the previous page around so the pager stays mounted while loading.
    setState((previous) => ({ ...previous, isLoading: true }));

    nextApi
      .fetch("psm/swaps", { method, page, pageSize })
      .then(({ result, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Failed to fetch dotUSD swaps", error);
          setState({ swaps: [], total: 0, page, isLoading: false });
          return;
        }

        setState({
          swaps: result?.items ?? [],
          total: result?.total ?? 0,
          page,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch dotUSD swaps", error);

        if (isMounted) {
          setState({ swaps: [], total: 0, page, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [method, page, pageSize]);

  return state;
}
