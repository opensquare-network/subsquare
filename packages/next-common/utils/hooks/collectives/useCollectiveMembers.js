import { useEffect, useRef, useState } from "react";
import useIsMounted from "../useIsMounted";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveMembers(moduleName = "council") {
  const api = useContextApi();
  const cache = useRef({});
  const isMounted = useIsMounted();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api || !api.query?.[moduleName]?.members) {
      return;
    }

    if (cache.current[moduleName]) {
      if (isMounted.current) {
        setMembers(cache.current[moduleName]);
      }
      return;
    }

    setLoading(true);
    api.query[moduleName]
      .members()
      .then((members) => {
        if (isMounted.current) {
          const normalized = members.toJSON();
          setMembers(normalized);
          cache.current[moduleName] = normalized;
        }
      })
      .finally(() => {
        if (isMounted.current) {
          setLoading(false);
        }
      });
  }, [api]);

  return {
    members,
    loading,
  };
}
