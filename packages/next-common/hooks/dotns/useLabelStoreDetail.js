import { useEffect, useState } from "react";
import { fetchLabelStoreDetail } from "next-common/services/dotns";

export default function useLabelStoreDetail(labelStore) {
  const [state, setState] = useState({
    detail: null,
    isLoading: !!labelStore,
    error: null,
  });

  useEffect(() => {
    if (!labelStore) {
      setState({ detail: null, isLoading: false, error: null });
      return;
    }

    let isMounted = true;
    setState({ detail: null, isLoading: true, error: null });

    fetchLabelStoreDetail(labelStore)
      .then((detail) => {
        if (isMounted) {
          setState({ detail, isLoading: false, error: null });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch dotNS label store", error);
        if (isMounted) {
          setState({ detail: null, isLoading: false, error });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [labelStore]);

  return state;
}
