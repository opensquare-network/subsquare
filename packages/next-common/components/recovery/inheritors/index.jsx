"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";
import { InheritorsDataProvider, useInheritorsData } from "./context";
import InheritedAccountsSection from "./inheritedAccountsSection";
import InheritorFriendGroupsSection from "./inheritorFriendGroupsSection";
import Loading from "next-common/components/loading";

function InheritorsSections() {
  const { loading } = useInheritorsData();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading size={24} />
      </div>
    );
  }

  return (
    <>
      <InheritedAccountsSection />
      <InheritorFriendGroupsSection />
    </>
  );
}

export default function InheritorsContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <InheritorsDataProvider address={address}>
        <div className="flex flex-col gap-6">
          <RecoverySubTabs className="mx-6" activeTab="inheritors" />
          <InheritorsSections />
        </div>
      </InheritorsDataProvider>
    </RelayChainApiProvider>
  );
}
