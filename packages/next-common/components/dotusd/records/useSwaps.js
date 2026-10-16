import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";
import { defaultPageSize } from "next-common/utils/constants";
import { SWAP_METHOD } from "./swapRecords";

// The two swap directions live in their own collections, so each of them is served by its own
// api.
const SWAP_ENDPOINTS = new Map([
  [SWAP_METHOD.mint, "psm/minted-events"],
  [SWAP_METHOD.redeem, "psm/redeemed-events"],
]);

/**
 * One page of the swaps of the dotUSD PSM of one direction, newest first. The block scan of
 * Asset Hub indexes the `psm.Minted` and `psm.Redeemed` events into their own collections, and
 * the backend serves each of them together with the total, which is what lets the pager name a
 * page.
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
    const endpoint = SWAP_ENDPOINTS.get(method);
    if (!endpoint) {
      setState({ swaps: [], total: 0, page: 1, isLoading: false });
      return;
    }

    let isMounted = true;
    // Keep the total of the previous page around so the pager stays mounted while loading.
    setState((previous) => ({ ...previous, isLoading: true }));

    nextApi
      .fetch(endpoint, { page, pageSize })
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
