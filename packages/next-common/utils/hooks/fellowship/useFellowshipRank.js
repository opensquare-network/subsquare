import { useEffect, useState } from "react";
import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import useRealAddress from "../useRealAddress";

export default function useFellowshipRank() {
  const api = useApi();
  const [rank, setRank] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const realAddress = useRealAddress();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    api.query.fellowshipCollective
      .members(realAddress)
      .then((data) => {
        setRank(data.toJSON());
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  }, [api, realAddress, isMounted]);

  return { rank, isLoading };
}
