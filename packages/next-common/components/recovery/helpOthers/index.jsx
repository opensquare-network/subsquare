"use client";

import { useCallback } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import InFriendGroupsSection from "./inFriendGroupsSection";
import HelpOthersAttemptsSection from "./helpOthersAttemptsSection";
import useHelpOthersFriendGroups from "./hooks/useHelpOthersFriendGroups";
import useHelpOthersAttempts from "./hooks/useHelpOthersAttempts";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function HelpOthersContent() {
  const address = useRealAddress();
  const friendGroups = useHelpOthersFriendGroups(address);
  const attempts = useHelpOthersAttempts(address);

  const fetchFriendGroups = friendGroups.fetch;
  const fetchAttempts = attempts.fetch;

  const refreshAll = useCallback(() => {
    fetchFriendGroups();
    fetchAttempts();
  }, [fetchFriendGroups, fetchAttempts]);

  return (
    <RelayChainApiProvider>
      <div className="flex flex-col gap-6">
        <RecoverySubTabs className="mx-6" activeTab="help_recover" />
        <HelpOthersAttemptsSection
          address={address}
          data={attempts.data}
          loading={attempts.loading}
          friendGroupsData={attempts.friendGroupsData}
          onRefresh={refreshAll}
        />
        <InFriendGroupsSection
          data={friendGroups.data}
          loading={friendGroups.loading}
          onRefresh={refreshAll}
        />
      </div>
    </RelayChainApiProvider>
  );
}
