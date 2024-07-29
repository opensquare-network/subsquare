import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export function useUnscrupulousAccounts() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useContextApi();
  const { value: accounts } = useCall(
    api?.query?.alliance?.unscrupulousAccounts,
    [],
  );
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
