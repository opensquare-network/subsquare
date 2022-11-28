import { useEffect, useState } from "react";
import { getDemocracyDelegation } from "../../democracy/getDemocracyDelegation";
import useIsMounted from "../useIsMounted";

export default function useDemocracyDelegating(api, address) {
  const [delegating, setDelegating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();

  const refresh = async () => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getDemocracyDelegation(api, address)
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
    refresh();
  }, [api, address]);

  return { delegating, isLoading, refresh };
}
