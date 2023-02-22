import useApi from "next-common/utils/hooks/useApi";
import useCall from "next-common/utils/hooks/useCall";
import { useEffect, useState } from "react";

export function useUnscrupulousWebsites() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useApi();
  const websites = useCall(api?.query?.alliance?.unscrupulousWebsites, []);
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
