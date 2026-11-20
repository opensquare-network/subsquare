import { useEffect, useState } from "react";
import nextApi from "next-common/services/nextApi";

/**
 * The 24h flow of the dotUSD psm, served by the backend: what was minted, what was redeemed,
 * and the difference. The amounts are strings, as u128 does not fit a number.
 */
export default function usePsmStats() {
  const [state, setState] = useState({ stats: null, isLoading: true });

  useEffect(() => {
    let isMounted = true;

    nextApi
      .fetch("psm/stats")
      .then(({ result, error }) => {
        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Failed to fetch dotUSD psm stats", error);
          setState({ stats: null, isLoading: false });
          return;
        }

        setState({ stats: result ?? null, isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to fetch dotUSD psm stats", error);

        if (isMounted) {
          setState({ stats: null, isLoading: false });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
