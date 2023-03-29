import useApi from "../useApi";
import useIsMounted from "../useIsMounted";
import { useEffect, useState } from "react";

export default function useCollectiveVoting(moduleName = "council", hash) {
  const api = useApi();
  const isMounted = useIsMounted();
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState();

  useEffect(() => {
    if (!api || !api.query?.[moduleName]?.voting) {
      return;
    }

    setLoading(true);
    api.query[moduleName].voting(hash).then((wrappedVoting) => {
      if (wrappedVoting?.isSome && isMounted.current) {
        setVoting(wrappedVoting.unwrap());
      }
    }).finally(() => {
      if (isMounted.current) {
        setLoading(false);
      }
    });
  }, [api, isMounted, hash]);

  return {
    voting,
    loading,
  };
}
