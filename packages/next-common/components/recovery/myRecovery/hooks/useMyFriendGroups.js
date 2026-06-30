import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useMyFriendGroups(address) {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  const fetch = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    if (!api?.query.recovery?.friendGroups) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery
      .friendGroups(address)
      .then((value) => {
        if (cancelled) return;
        const json = value.toJSON();
        const groups = Array.isArray(json?.[0]) ? json[0] : [];
        const mapped = groups.map((group, index) => ({
          index,
          friends: group.friends || [],
          friendsNeeded: parseInt(group.friendsNeeded) || 0,
          inheritor: group.inheritor || "",
          inheritancePriority: parseInt(group.inheritancePriority) || 0,
          inheritanceDelay: parseInt(group.inheritanceDelay) || 0,
          cancelDelay: parseInt(group.cancelDelay) || 0,
        }));
        setData(mapped);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to query friend groups", error);
        if (!cancelled) {
          setData([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, address, fetchCount]);

  return { data, loading, fetch };
}
