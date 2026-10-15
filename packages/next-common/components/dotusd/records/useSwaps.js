import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { defaultPageSize } from "next-common/utils/constants";
import { getStatescanApiUrl } from "next-common/utils/statescan";
import { swapsPage } from "./swapRecords";

/**
 * One page of the swaps of the dotUSD PSM, newest first. The block scan of Asset Hub indexes the
 * `psm.Minted` and `psm.Redeemed` events, and its api lists them by `section` and `method`, sorted
 * by block height, which is the order this table reads them in.
 */
export default function useSwaps(method, page, pageSize = defaultPageSize) {
  const { assethubMigration } = useChainSettings();
  const apiUrl = getStatescanApiUrl(
    assethubMigration?.statescanAssethubApiDomain,
  );
  const [state, setState] = useState({
    swaps: [],
    hasMore: false,
    isLoading: true,
  });

  useEffect(() => {
    if (isNil(method) || !apiUrl) {
      setState({ swaps: [], hasMore: false, isLoading: false });
      return;
    }

    const controller = new AbortController();
    // Keep the rows of the previous page around so the table keeps its height while loading.
    setState((previous) => ({ ...previous, isLoading: true }));

    // A row more than the page holds tells whether another page is left, which the api does not
    // report itself.
    fetch(
      `${apiUrl}/events?section=psm&method=${method}&page=${
        page - 1
      }&page_size=${pageSize + 1}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return response.json();
      })
      .then((data) => {
        setState({
          ...swapsPage({ items: data?.items ?? [], pageSize }),
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Failed to fetch dotUSD swaps", error);
        setState({ swaps: [], hasMore: false, isLoading: false });
      });

    return () => controller.abort();
  }, [method, page, pageSize, apiUrl]);

  return state;
}
