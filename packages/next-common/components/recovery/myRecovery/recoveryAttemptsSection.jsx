"use client";

import useMyRecoveryAttempts from "./hooks/useMyRecoveryAttempts";
import useMyFriendGroups from "./hooks/useMyFriendGroups";
import MyRecoveryAttemptsTable from "./attemptsTable";

export default function RecoveryAttemptsSection({ address }) {
  const { data: attempts, loading: attemptsLoading } =
    useMyRecoveryAttempts(address);
  const { data: friendGroups } = useMyFriendGroups(address);

  const friendGroupsFormatted = address
    ? [{ account: address, friendGroups: friendGroups }]
    : [];

  return (
    <div>
      <div className="pl-6">
        <span className="font-bold text-[16px] leading-6 text-textPrimary">
          Ongoing Recovery Attempts
        </span>
      </div>
      <div className="mt-4">
        <MyRecoveryAttemptsTable
          data={attempts}
          loading={attemptsLoading}
          friendGroups={friendGroupsFormatted}
        />
      </div>
    </div>
  );
}
