import { useEffect, useState } from "react";
import useIsMounted from "../useIsMounted";
import { getGov2TrackDelegation } from "../../gov2/gov2ReferendumVote";
import isNil from "lodash.isnil";

export function useTrackDelegating(api, trackId, address) {
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = async () => {
    if (!api || !address || isNil(trackId)) {
      return;
    }

    setIsLoading(true);
    getGov2TrackDelegation(api, trackId, address)
      .then((delegating) => {
        if (isMounted.current) {
          setDelegating(delegating);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  };

  useEffect(() => {
    setDelegating(null);
    refresh();
  }, [api, trackId, address]);

  return { delegating, isLoading, refresh };
}
