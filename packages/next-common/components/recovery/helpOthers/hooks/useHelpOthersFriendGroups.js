import { useMemo } from "react";
import useQueryAllFriendGroups, {
  flattenRecoveryData,
} from "next-common/components/data/recovery/hooks/useQueryAllFriendGroups";

export default function useHelpOthersFriendGroups(address) {
  const { data: allData, loading, fetch } = useQueryAllFriendGroups();

  const data = useMemo(() => {
    if (!address) return [];

    const filtered = allData.filter((entry) =>
      entry.friendGroups.some((g) =>
        g.friends.some((f) => f?.toLowerCase() === address?.toLowerCase()),
      ),
    );

    return flattenRecoveryData(filtered);
  }, [allData, address]);

  return { data, loading, fetch };
}
