import { useEffect, useState } from "react";
import useIsMounted from "../useIsMounted";
import { getGov2AddressVote } from "../../gov2/gov2ReferendumVote";

export default function useAddressVote(
  api,
  trackId,
  referendumIndex,
  address,
  updateTime,
) {
  const [vote, setVote] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useIsMounted();
  useEffect(() => {
    if (!api || !address) {
      return;
    }

    setIsLoading(true);
    getGov2AddressVote(api, trackId, referendumIndex, address)
      .then((vote) => {
        if (isMounted.current) {
          setVote(vote);
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setIsLoading(false);
        }
      });
  }, [api, trackId, referendumIndex, address, isMounted, updateTime]);
  return [vote, isLoading];
}
