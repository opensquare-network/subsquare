import { useEffect, useState } from "react";
import useIsMounted from "../useIsMounted";
import { getGov2TrackDelegation } from "../../gov2/gov2ReferendumVote";

export default function useTrackDelegating(api, trackId, address) {
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = async () => {
    setIsLoading(true);
    getGov2TrackDelegation(api, trackId, address)
      .then((delegating) => {
        if (isMounted.current) {
          setDelegating(delegating);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setDelegating(null);

    if (!api || !address) {
      return;
    }

    refresh();
  }, [api, trackId, address]);

  return { delegating, isLoading, refresh };
}
