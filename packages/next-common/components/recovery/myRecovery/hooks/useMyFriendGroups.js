import { useMemo } from "react";
import useQueryAllFriendGroups from "next-common/components/data/recovery/hooks/useQueryAllFriendGroups";

export default function useMyFriendGroups(address) {
  const { data: allData, loading, fetch } = useQueryAllFriendGroups();

  const data = useMemo(() => {
    if (!address) return [];
    const entry = allData.find((e) => e.account === address);
    return entry?.friendGroups || [];
  }, [allData, address]);

  return { data, loading, fetch };
}
