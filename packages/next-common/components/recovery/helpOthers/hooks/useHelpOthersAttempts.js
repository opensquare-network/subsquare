import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

export default function useHelpOthersAttempts(address) {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendGroupsData, setFriendGroupsData] = useState([]);
  const [fetchCount, setFetchCount] = useState(0);

  const fetch = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    if (!api?.query.recovery?.attempt) {
      setLoading(false);
      setData([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery.attempt
      .entries()
      .then(async (entries) => {
        if (cancelled) return;

        // Collect unique lostAccounts to fetch their friend groups
        const lostAccounts = [
          ...new Set(entries.map(([key]) => key.args?.[0]?.toString())),
        ];
        const friendGroupsMap = {};

        await Promise.all(
          lostAccounts.map(async (account) => {
            try {
              const value = await api.query.recovery.friendGroups(account);
              const json = value.toJSON();
              friendGroupsMap[account] = json?.[0] || [];
            } catch {
              friendGroupsMap[account] = [];
            }
          }),
        );

        // Build raw friend groups data for enhanceAttemptWithFriendGroup
        const rawFriendGroups = Object.entries(friendGroupsMap).map(
          ([account, groups]) => ({
            account,
            friendGroups: groups.map((group, index) => ({
              index,
              friends: group.friends || [],
              friendsNeeded: parseInt(group.friendsNeeded) || 0,
              inheritor: group.inheritor || "",
              inheritancePriority: parseInt(group.inheritancePriority) || 0,
              inheritanceDelay: parseInt(group.inheritanceDelay) || 0,
              cancelDelay: parseInt(group.cancelDelay) || 0,
            })),
          }),
        );

        // Filter entries where current address is a friend of the lost account
        const filtered = entries.filter(([storageKey]) => {
          const lostAccount = storageKey.args?.[0]?.toString();
          const friendGroups = friendGroupsMap[lostAccount] || [];
          return friendGroups.some((group) =>
            (group.friends || []).some(
              (f) => f?.toLowerCase() === address?.toLowerCase(),
            ),
          );
        });

        if (cancelled) return;

        const result = filtered.map(([storageKey, value]) => {
          const lostAccount = storageKey.args?.[0]?.toString();
          const friendGroupIndex = storageKey.args?.[1]?.toNumber();
          const json = value.toJSON();
          const attempt = json?.[0] || {};

          const approvalsBitfield = attempt.approvals || [];
          // Simple bitfield to indices
          const approvedIndices = [];
          let bitIndex = 0;
          for (const byte of approvalsBitfield) {
            if (typeof byte === "number") {
              for (let b = 0; b < 8; b++) {
                if (byte & (1 << b)) approvedIndices.push(bitIndex + b);
              }
            }
            bitIndex += 8;
          }

          const approvalsCount = approvedIndices.length;

          const friendGroup =
            (friendGroupsMap[lostAccount] || [])[friendGroupIndex] || {};
          const friends = friendGroup.friends || [];
          const approvedAddresses = approvedIndices
            .filter((i) => i < friends.length)
            .map((i) => friends[i]);

          return {
            lostAccount,
            friendGroupIndex,
            initiator: attempt.initiator || "",
            initBlock: parseInt(attempt.initBlock) || 0,
            lastApprovalBlock: parseInt(attempt.lastApprovalBlock) || 0,
            approvalsCount,
            approvedAddresses,
            friendsNeeded: friendGroup.friendsNeeded || 0,
          };
        });

        if (!cancelled) {
          setData(result);
          setFriendGroupsData(rawFriendGroups);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to query help others attempts", error);
        if (!cancelled) {
          setData([]);
          setFriendGroupsData([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, address, fetchCount]);

  return { data, loading, friendGroupsData, fetch };
}
