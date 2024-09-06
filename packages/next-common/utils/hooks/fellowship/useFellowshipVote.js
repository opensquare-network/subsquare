import { useEffect, useState } from "react";
import { useMountedState } from "react-use";
import { getFellowshipVote } from "../../gov2/getFellowshipVote";
import { useContextApi } from "next-common/context/api";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

export default function useFellowshipVote(referendumIndex, address) {
  const api = useContextApi();
  const [vote, setVote] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMountedState();
  const collectivePallet = useRankedCollectivePallet();

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getFellowshipVote(api, referendumIndex, address, collectivePallet)
      .then((result) => {
        setVote(result);
      })
      .finally(() => {
        if (isMounted()) {
          setIsLoading(false);
        }
      });
  }, [api, referendumIndex, address, isMounted, collectivePallet]);

  return { vote, isLoading };
}
