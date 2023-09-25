import { useEffect, useState } from "react";
import useApi from "../useApi";
import useIsMounted from "../useIsMounted";

export default function useFellowshipRank(address) {
  const api = useApi();
  const [rank, setRank] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!address) {
      return;
    }

    setIsLoading(true);
    api.query.fellowshipCollective
      .members(address)
      .then((data) => {
        setRank(data.toJSON());
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  }, [api, address, isMounted]);

  return { rank, isLoading };
}
