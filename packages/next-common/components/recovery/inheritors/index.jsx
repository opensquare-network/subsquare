"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import InheritedAccountsSection from "./inheritedAccountsSection";
import InheritorFriendGroupsSection from "./inheritorFriendGroupsSection";

export default function InheritorsContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <div className="flex flex-col gap-6">
        <RecoverySubTabs className="mx-6" activeTab="inheritors" />
        <InheritedAccountsSection address={address} />
        <InheritorFriendGroupsSection address={address} />
      </div>
    </RelayChainApiProvider>
  );
}
