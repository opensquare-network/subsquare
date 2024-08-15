import { useCallback, useState } from "react";
import useSubStorage from "next-common/hooks/common/useSubStorage";

export function useFellowshipMemberParams() {
  const [params, setParams] = useState(null);
  const { loading: isLoading } = useSubStorage(
    "fellowshipCore",
    "params",
    [],
    useCallback((rawOptional) => {
      setParams(rawOptional.toJSON());
    }, []),
  );

  return { isLoading, params };
}
