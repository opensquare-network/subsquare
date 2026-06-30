"use client";

import RecoverySubTabs from "next-common/components/recovery/subTabs";
import { RelayChainApiProvider } from "next-common/context/relayChain";

export default function InheritorsContent() {
  return (
    <RelayChainApiProvider>
      <div className="flex flex-col gap-6">
        <RecoverySubTabs className="mx-6" activeTab="inheritors" />
        <div className="text14Medium text-textTertiary">
          Inheritants placeholder content. View recovery configurations where
          you are designated as an inheritor.
        </div>
      </div>
    </RelayChainApiProvider>
  );
}
