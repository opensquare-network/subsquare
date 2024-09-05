import { useEffect, useRef, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveMembers(moduleName = "council") {
  const api = useContextApi();
  const cache = useRef({});
  const isMounted = useMountedState();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api || !api.query?.[moduleName]?.members) {
      return;
    }

    if (cache.current[moduleName]) {
      if (isMounted()) {
        setMembers(cache.current[moduleName]);
      }
      return;
    }

    setLoading(true);
    api.query[moduleName]
      .members()
      .then((members) => {
        if (isMounted()) {
          const normalized = members.toJSON();
          setMembers(normalized);
          cache.current[moduleName] = normalized;
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoading(false);
        }
      });
  }, [api, isMounted, moduleName]);

  return {
    members,
    loading,
  };
}
