import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useFellowshipParams(pallet = "fellowshipCore") {
  const [params, setParams] = useState(null);
  const { loading: isLoading } = useSubStorage(
    pallet,
    "params",
    [],
    {
      callback: useCallback((rawOptional) => {
        setParams(rawOptional.toJSON());
      }, []),
    },
  );

  return { isLoading, params };
}
