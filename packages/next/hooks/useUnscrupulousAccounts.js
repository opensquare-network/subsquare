import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

export function useUnscrupulousAccounts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const [accounts] = useCall(api?.query?.alliance?.unscrupulousAccounts, []);
  useEffect(() => {
    if (accounts) {
      setData(accounts.toJSON());
    }

    setIsLoading(false);
  }, [accounts]);

  return {
    data,
    isLoading,
  };
}
