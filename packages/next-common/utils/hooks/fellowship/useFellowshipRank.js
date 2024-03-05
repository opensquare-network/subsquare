import { useEffect, useState } from "react";
import useIsMounted from "../useIsMounted";
import { useContextApi } from "next-common/context/api";

export default function useFellowshipRank(address) {
  const api = useContextApi();
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
