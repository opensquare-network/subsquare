import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export function flattenRecoveryData(data) {
  if (!data || data.length === 0) {
    return [];
  }

  const rows = [];
  for (const entry of data) {
    for (const group of entry.friendGroups) {
      rows.push({
        account: entry.account,
        index: group.index,
        inheritancePriority: group.inheritancePriority,
        friends: group.friends,
        friendsNeeded: group.friendsNeeded,
        inheritor: group.inheritor,
        inheritanceDelay: group.inheritanceDelay,
        cancelDelay: group.cancelDelay,
      });
    }
  }
  return rows;
}

export default function useQueryAllFriendGroups() {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  const fetch = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!api?.query.recovery?.friendGroups) {
      setLoading(false);
      setData([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery.friendGroups
      .entries()
      .then((entries) => {
        if (cancelled) return;

        const result = entries.map(([storageKey, value]) => {
          const account = storageKey.args?.[0]?.toString();
          const jsonValue = value.toJSON();
          const friendGroupVec = Array.isArray(jsonValue?.[0])
            ? jsonValue[0]
            : [];

          return {
            account,
            friendGroups: friendGroupVec.map((group, index) => ({
              index,
              friends: group.friends || [],
              friendsNeeded: parseInt(group.friendsNeeded) || 0,
              inheritor: group.inheritor || "",
              inheritancePriority: parseInt(group.inheritancePriority) || 0,
              inheritanceDelay: parseInt(group.inheritanceDelay) || 0,
              cancelDelay: parseInt(group.cancelDelay) || 0,
            })),
          };
        });

        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to query recovery friend groups", error);
        if (!cancelled) {
          setData([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, fetchCount]);

  return { data, loading, fetch };
}
