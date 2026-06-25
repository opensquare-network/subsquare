import { useContextApi } from "next-common/context/api";
import { useEffect, useState } from "react";

function bitfieldToIndices(bitfield) {
  const indices = [];
  let bitIndex = 0;
  for (const byte of bitfield) {
    if (typeof byte === "number") {
      for (let b = 0; b < 8; b++) {
        if (byte & (1 << b)) indices.push(bitIndex + b);
      }
    }
    bitIndex += 8;
  }
  return indices;
}

export default function useMyRecoveryAttempts(address) {
  const api = useContextApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!api || !address) {
      return;
    }

    if (!api?.query.recovery?.attempt) {
      return;
    }

    let cancelled = false;
    setLoading(true);

    api.query.recovery.attempt
      .entries()
      .then(async (entries) => {
        if (cancelled) return;

        // Filter entries where lostAccount matches current address
        const myEntries = entries.filter(
          ([key]) => key.args?.[0]?.toString() === address,
        );

        // Collect unique lostAccounts to fetch their friend groups
        const lostAccounts = [
          ...new Set(myEntries.map(([key]) => key.args?.[0]?.toString())),
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

        const result = myEntries.map(([storageKey, value]) => {
          const friendGroupIndex = storageKey.args?.[1]?.toNumber();
          const json = value.toJSON();
          const attempt = json?.[0] || {};

          const approvalsBitfield = attempt.approvals || [];
          const approvedIndices = bitfieldToIndices(approvalsBitfield);
          const approvalsCount = approvedIndices.length;

          const friendGroup =
            (friendGroupsMap[address] || [])[friendGroupIndex] || {};
          const friends = friendGroup.friends || [];
          const approvedAddresses = approvedIndices
            .filter((i) => i < friends.length)
            .map((i) => friends[i]);

          return {
            lostAccount: address,
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
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Failed to query recovery attempts", error);
        if (!cancelled) {
          setData([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, address]);

  return { data, loading };
}
