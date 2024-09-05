import { useMountedState } from "react-use";
import { useEffect, useState } from "react";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveVoting(moduleName = "council", hash) {
  const api = useContextApi();
  const isMounted = useMountedState();
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState();

  useEffect(() => {
    if (!api || !api.query?.[moduleName]?.voting) {
      return;
    }

    setLoading(true);
    api.query[moduleName]
      .voting(hash)
      .then((wrappedVoting) => {
        if (wrappedVoting?.isSome && isMounted()) {
          setVoting(wrappedVoting.unwrap());
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoading(false);
        }
      });
  }, [api, isMounted, hash, moduleName]);

  return {
    voting,
    loading,
  };
}
