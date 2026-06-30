"use client";

import useRealAddress from "next-common/utils/hooks/useRealAddress";
import RecoverySubTabs from "next-common/components/recovery/subTabs";
import InFriendGroupsSection from "./inFriendGroupsSection";
import HelpOthersAttemptsSection from "./helpOthersAttemptsSection";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function HelpOthersContent() {
  const address = useRealAddress();

  return (
    <RelayChainApiProvider>
      <div className="flex flex-col gap-6">
        <RecoverySubTabs className="mx-6" activeTab="help_recover" />
        <HelpOthersAttemptsSection address={address} />
        <InFriendGroupsSection address={address} />
      </div>
    </RelayChainApiProvider>
  );
}
