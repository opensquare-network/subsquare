"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import FriendGroupsSection from "./friendGroupsSection";
import InheritorSection from "./inheritorSection";
import RecoveryAttemptsSection from "./recoveryAttemptsSection";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { RecoveryDataProvider, useRecoveryData } from "./context";
import Loading from "next-common/components/loading";

function MyRecoverySections() {
  const { loading } = useRecoveryData();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading size={24} />
      </div>
    );
  }

  return (
    <>
      <RecoveryAttemptsSection />
      <InheritorSection />
      <FriendGroupsSection />
    </>
  );
}

export default function MyRecoveryContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <RecoveryDataProvider address={address}>
        <div className="flex flex-col gap-6">
          <RecoverySubTabs className="mx-6" activeTab="my_recovery" />
          <MyRecoverySections />
        </div>
      </RecoveryDataProvider>
    </RelayChainApiProvider>
  );
}
