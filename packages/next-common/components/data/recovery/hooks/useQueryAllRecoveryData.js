import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

export default function useQueryAllRecoveryData() {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api?.query.recovery?.friendGroups) {
      if (api) {
        setLoading(false);
        setData([]);
      }
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
          // value is a Codec tuple (FriendGroupVec, Ticket)
          // Use toHuman() to get a plain JS array, then access elements
          const humanValue = value.toHuman();
          const friendGroupVec = Array.isArray(humanValue?.[0])
            ? humanValue[0]
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
  }, [api]);

  return { data, loading };
}
