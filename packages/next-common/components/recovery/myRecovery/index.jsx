"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import FriendGroupsSection from "./friendGroupsSection";
import RecoveryAttemptsSection from "./recoveryAttemptsSection";
import RecoverySubTabs from "next-common/components/recovery/subTabs";

export default function MyRecoveryContent() {
  const address = useRealAddress();

  return (
    <div className="flex flex-col gap-6">
      <RecoverySubTabs className="mx-6" activeTab="my_recovery" />
      <FriendGroupsSection address={address} />
      <RecoveryAttemptsSection address={address} />
    </div>
  );
}
