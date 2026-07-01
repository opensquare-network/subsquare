import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";
import { flattenRecoveryData } from "next-common/components/data/recovery/hooks/useQueryAllFriendGroups";

export default function useInheritorFriendGroups(address) {
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

        // Filter to entries where current address is an inheritor
        const filtered = result.filter((entry) =>
          entry.friendGroups.some(
            (g) => g.inheritor?.toLowerCase() === address?.toLowerCase(),
          ),
        );

        // Flatten for table display
        const flattened = flattenRecoveryData(filtered);

        if (!cancelled) {
          setData(flattened);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to query inheritor friend groups", error);
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
