import { useMemo } from "react";
import useRecoveryAttemptsData, {
  buildFriendGroupsData,
} from "next-common/components/recovery/common/hooks/useRecoveryAttemptsData";

export default function useHelpOthersAttempts(address) {
  const { attempts, loading, fetch, friendGroupsMap } =
    useRecoveryAttemptsData();

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
