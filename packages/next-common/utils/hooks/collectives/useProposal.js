import { useEffect, useRef, useState } from "react";
import useIsMounted from "../useIsMounted";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveProposal(moduleName = "council", hash) {
  const api = useContextApi();
  const cache = useRef({});
  const isMounted = useIsMounted();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api || !api.query?.[moduleName]?.proposalOf) {
      return;
    }

    if (!cache.current[moduleName]) {
      cache.current[moduleName] = {};
    }

    if (
      cache.current[moduleName] &&
      cache.current[moduleName][hash] &&
      isMounted.current
    ) {
      setProposal(cache.current[moduleName][hash]);
      return;
    }

    setLoading(true);
    api.query[moduleName]
      .proposalOf(hash)
      .then((wrappedProposal) => {
        if (wrappedProposal?.isSome && isMounted.current) {
          const proposal = wrappedProposal.unwrap();
          setProposal(proposal);
          cache.current[moduleName][hash] = proposal;
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, [api, isMounted, hash]);

  return {
    proposal,
    loading,
  };
}
