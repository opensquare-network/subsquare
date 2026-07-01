"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import FriendGroupsSection from "./friendGroupsSection";
import InheritorSection from "./inheritorSection";
import RecoveryAttemptsSection from "./recoveryAttemptsSection";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function MyRecoveryContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <div className="flex flex-col gap-6">
        <RecoverySubTabs className="mx-6" activeTab="my_recovery" />
        <RecoveryAttemptsSection address={address} />
        <InheritorSection address={address} />
        <FriendGroupsSection address={address} />
      </div>
    </RelayChainApiProvider>
  );
}
