import { useEffect, useState } from "react";
import { fetchDotNsWebIds } from "next-common/services/dotns";

export default function useDotNsWebIds() {
  const [state, setState] = useState({
    dotNsWebIds: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    fetchDotNsWebIds()
      .then((dotNsWebIds) => {
        if (isMounted) {
          setState({ dotNsWebIds, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch dotNS web IDs", error);
        if (isMounted) {
          setState({ dotNsWebIds: [], isLoading: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
