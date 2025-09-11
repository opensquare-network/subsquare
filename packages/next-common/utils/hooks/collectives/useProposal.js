import { useEffect, useRef, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveProposal(moduleName = "council", hash) {
  const api = useContextApi();
  const cache = useRef({});
  const isMounted = useMountedState();
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
      isMounted()
    ) {
      setProposal(cache.current[moduleName][hash]);
      return;
    }

    setLoading(true);
    api.query[moduleName]
      .proposalOf(hash)
      .then((wrappedProposal) => {
        if (wrappedProposal?.isSome && isMounted()) {
          const proposal = wrappedProposal.unwrap();
          setProposal(proposal);
          cache.current[moduleName][hash] = proposal;
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoading(false);
        }
      });
  }, [api, isMounted, hash, moduleName]);

  return {
    proposal,
    loading,
  };
}
