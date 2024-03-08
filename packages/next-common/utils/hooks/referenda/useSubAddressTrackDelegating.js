import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useSubAddressTrackDelegating(address, trackId) {
  const api = useContextApi();
  const [delegating, setDelegating] = useState(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    let unsub;
    api.query.convictionVoting
      .votingFor(address, trackId, (optionalVotingFor) => {
        const jsonVoting = optionalVotingFor?.toJSON();
        if (!jsonVoting) {
          return setDelegating(null);
        }

        return setDelegating(jsonVoting?.delegating);
      })
      .then((result) => {
        unsub = result;
      });

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, [api]);

  return delegating;
}
