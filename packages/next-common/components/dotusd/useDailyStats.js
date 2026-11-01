import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

/**
 * The daily snapshots of one dotUSD metric served by the backend, oldest first. `days` is
 * forwarded to the api when set, and the api decides how much history it returns otherwise.
 */
export default function useDailyStats(path, days) {
  const [state, setState] = useState({ items: [], isLoading: true });

  useEffect(() => {
    let isMounted = true;
    // Keep the previous points on screen while the next response loads.
    setState((previous) => ({ ...previous, isLoading: true }));

    const params = days === undefined ? {} : { days };

    nextApi
      .fetch(path, params)
      .then(({ result, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error(`Failed to fetch ${path}`, error);
          setState({ items: [], isLoading: false });
          return;
        }

        setState({
          items: Array.isArray(result) ? result : [],
          isLoading: false,
        });
      })
      .catch((error) => {
        console.error(`Failed to fetch ${path}`, error);

        if (isMounted) {
          setState({ items: [], isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [path, days]);

  return state;
}
