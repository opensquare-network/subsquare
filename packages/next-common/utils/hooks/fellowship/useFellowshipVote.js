import { useEffect, useState } from "react";
import useIsMounted from "../useIsMounted";
import useApi from "../useApi";
import { getFellowshipVote } from "../../gov2/getFellowshipVote";

export default function useFellowshipVote(referendumIndex, address) {
  const api = useApi();
  const [vote, setVote] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  useEffect(() => {
    if (!api) {
      return;
    }

    setIsLoading(true);
    getFellowshipVote(api, referendumIndex, address)
      .then((result) => {
        setVote(result);
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  }, [api, referendumIndex, address, isMounted]);

  return { vote, isLoading };
}
