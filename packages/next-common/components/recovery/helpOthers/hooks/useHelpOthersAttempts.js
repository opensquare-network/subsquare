import { useMemo } from "react";
import useQueryAllRecoveryAttempts, {
  buildFriendGroupsData,
} from "next-common/components/data/recovery/hooks/useQueryAllRecoveryAttempts";

export default function useHelpOthersAttempts(address) {
  const {
    data: attempts,
    loading,
    fetch,
    friendGroupsMap,
  } = useQueryAllRecoveryAttempts();

  const data = useMemo(() => {
    if (!address) return [];

    return attempts.filter((attempt) => {
      const friendGroups = friendGroupsMap[attempt.lostAccount] || [];
      return friendGroups.some((group) =>
        (group.friends || []).some(
          (f) => f?.toLowerCase() === address?.toLowerCase(),
        ),
      );
    });
  }, [attempts, friendGroupsMap, address]);

  const friendGroupsData = useMemo(
    () => buildFriendGroupsData(friendGroupsMap),
    [friendGroupsMap],
  );

  return { data, loading, friendGroupsData, fetch };
}
