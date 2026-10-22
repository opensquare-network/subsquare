import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

export const dailyStatsDays = 7;

/**
 * The daily dotUSD snapshots served by the backend, oldest first. Each one holds the holder
 * count and the total issuance read from the Asset Hub state once a day, so the last one
 * reflects the current state of the asset.
 */
export default function useDailyStats(days = dailyStatsDays) {
  const [state, setState] = useState({ items: [], isLoading: true });

  useEffect(() => {
    let isMounted = true;
    // Keep the previous points on screen while the next response loads.
    setState((previous) => ({ ...previous, isLoading: true }));

    nextApi
      .fetch("dotusd/daily-stats", { days })
      .then(({ result, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Failed to fetch dotUSD daily stats", error);
          setState({ items: [], isLoading: false });
          return;
        }

        setState({
          items: Array.isArray(result) ? result : [],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error("Failed to fetch dotUSD daily stats", error);

        if (isMounted) {
          setState({ items: [], isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [days]);

  return state;
}
