import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { getFellowshipVote } from "../../gov2/getFellowshipVote";
import { useContextApi } from "next-common/context/api";

export default function useFellowshipVote(referendumIndex, address) {
  const api = useContextApi();
  const [vote, setVote] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedState();

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
        if (isMounted()) {
          setIsLoading(false);
        }
      });
  }, [api, referendumIndex, address, isMounted]);

  return { vote, isLoading };
}
