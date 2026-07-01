"use client";

import MyRecoveryAttemptsTable from "./attemptsTable";
import { useRecoveryData } from "./context";

export default function RecoveryAttemptsSection() {
  const { attempts, attemptsLoading, fetchAttempts, friendGroups, address } =
    useRecoveryData();

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
          onSlash={fetchAttempts}
          onCancel={fetchAttempts}
        />
      </div>
    </div>
  );
}
