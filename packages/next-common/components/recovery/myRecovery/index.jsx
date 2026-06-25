"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import FriendGroupsSection from "./friendGroupsSection";
import RecoveryAttemptsSection from "./recoveryAttemptsSection";

export default function MyRecoveryContent() {
  const address = useRealAddress();

  return (
    <div className="flex flex-col gap-6">
      <FriendGroupsSection address={address} />
      <RecoveryAttemptsSection address={address} />
    </div>
  );
}
