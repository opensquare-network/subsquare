"use client";

import { useCallback } from "react";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import InFriendGroupsSection from "./inFriendGroupsSection";
import HelpOthersAttemptsSection from "./helpOthersAttemptsSection";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { HelpOthersDataProvider, useHelpOthersData } from "./context";
import Loading from "next-common/components/loading";

function HelpOthersSections() {
  const {
    address,
    friendGroupsData,
    friendGroupsLoading,
    fetchFriendGroups,
    attemptsData,
    attemptsLoading,
    attemptsFriendGroupsData,
    fetchAttempts,
    loading,
  } = useHelpOthersData();

  const refreshAll = useCallback(() => {
    fetchFriendGroups();
    fetchAttempts();
  }, [fetchFriendGroups, fetchAttempts]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading size={24} />
      </div>
    );
  }

  return (
    <>
      <HelpOthersAttemptsSection
        address={address}
        data={attemptsData}
        loading={attemptsLoading}
        friendGroupsData={attemptsFriendGroupsData}
        onRefresh={refreshAll}
      />
      <InFriendGroupsSection
        data={friendGroupsData}
        loading={friendGroupsLoading}
        attemptsData={attemptsData}
        onRefresh={refreshAll}
      />
    </>
  );
}

export default function HelpOthersContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <HelpOthersDataProvider address={address}>
        <div className="flex flex-col gap-6">
          <RecoverySubTabs className="mx-6" activeTab="help_recover" />
          <HelpOthersSections />
        </div>
      </HelpOthersDataProvider>
    </RelayChainApiProvider>
  );
}
