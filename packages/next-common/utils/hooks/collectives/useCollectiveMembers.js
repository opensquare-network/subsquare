import { useEffect, useRef, useState } from "react";
import { useMountedState } from "react-use";
import { useContextApi } from "next-common/context/api";

export default function useCollectiveMembers(pallet = "council") {
  const api = useContextApi();
  const cache = useRef({});
  const isMounted = useMountedState();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!api || !api.query?.[pallet]?.members) {
      return;
    }

    if (cache.current[pallet]) {
      if (isMounted()) {
        setMembers(cache.current[pallet]);
      }
      return;
    }

    setLoading(true);
    api.query[pallet]
      .members()
      .then((members) => {
        if (isMounted()) {
          const normalized = members.toJSON();
          setMembers(normalized);
          cache.current[pallet] = normalized;
        }
      })
      .finally(() => {
        if (isMounted()) {
          setLoading(false);
        }
      });
  }, [api, isMounted, pallet]);

  return {
    members,
    loading,
  };
}
