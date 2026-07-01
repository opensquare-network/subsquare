import { useContextApi } from "next-common/context/api";
import { useCallback, useEffect, useState } from "react";

function bitfieldToIndices(bitfield) {
  const indices = [];
  let bitIndex = 0;
  for (const byte of bitfield) {
    if (typeof byte === "number") {
      for (let b = 0; b < 8; b++) {
        if (byte & (1 << b)) {
          indices.push(bitIndex + b);
        }
      }
    }
    bitIndex += 8;
  }
  return indices;
}

export function buildFriendGroupsData(friendGroupsMap) {
  return Object.entries(friendGroupsMap).map(([account, groups]) => ({
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
  }));
}

function processAttempts(entries, friendGroupsMap) {
  return entries.map(([storageKey, value]) => {
    const lostAccount = storageKey.args?.[0]?.toString();
    const friendGroupIndex = storageKey.args?.[1]?.toNumber();

    const json = value.toJSON();
    const attempt = json?.[0] || {};

    const approvalsBitfield = attempt.approvals || [];
    const approvedIndices = bitfieldToIndices(approvalsBitfield);
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
      friendsNeeded: parseInt(friendGroup.friendsNeeded) || 0,
    };
  });
}

/**
 * Fetch all recovery attempts and their friend groups.
 *
 * @returns {{ data: Array, loading: boolean, fetch: () => void, friendGroupsMap: object }}
 *   - data: all processed recovery attempt objects
 *   - loading: whether data is being fetched
 *   - fetch: trigger a re-fetch
 *   - friendGroupsMap: raw map of lostAccount -> friendGroups for building friendGroupsData
 */
export default function useQueryAllRecoveryAttempts() {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [friendGroupsMap, setFriendGroupsMap] = useState({});
  const [fetchCount, setFetchCount] = useState(0);

  const fetch = useCallback(() => setFetchCount((c) => c + 1), []);

  useEffect(() => {
    if (!api) {
      return;
    }

    if (!api?.query.recovery?.attempt) {
      setLoading(false);
      setData([]);
      setFriendGroupsMap({});
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery.attempt
      .entries()
      .then(async (entries) => {
        if (cancelled) return;

        const lostAccounts = [
          ...new Set(entries.map(([key]) => key.args?.[0]?.toString())),
        ];
        const fgMap = {};

        await Promise.all(
          lostAccounts.map(async (account) => {
            try {
              const value = await api.query.recovery.friendGroups(account);
              const json = value.toJSON();
              fgMap[account] = json?.[0] || [];
            } catch {
              fgMap[account] = [];
            }
          }),
        );

        if (cancelled) return;

        const result = processAttempts(entries, fgMap);

        if (!cancelled) {
          setData(result);
          setFriendGroupsMap(fgMap);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to query recovery attempts", error);
        if (!cancelled) {
          setData([]);
          setFriendGroupsMap({});
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, fetchCount]);

  return { data, loading, fetch, friendGroupsMap };
}
