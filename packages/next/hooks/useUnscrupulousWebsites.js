import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export function useUnscrupulousWebsites() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useContextApi();
  const { value: websites } = useCall(
    api?.query?.alliance?.unscrupulousWebsites,
    [],
  );
  useEffect(() => {
    if (websites) {
      setData(websites.toJSON());
    }

    setIsLoading(false);
  }, [websites]);

  return {
    data,
    isLoading,
  };
}
