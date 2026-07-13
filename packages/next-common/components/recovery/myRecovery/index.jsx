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
  const { loading, attempts, inheritor, friendGroups } = useRecoveryData();

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loading size={24} />
      </div>
    );
  }

  // 1) Sections with data always come before sections without data
  // 2) With data priority: attempts(1), inheritor(2), friend groups(3)
  // 3) Without data priority: friend groups(1), attempts(2), inheritor(3)
  const hasData = (arr) => arr && arr.length > 0;

  const sectionConfigs = [
    {
      key: "recoveryAttempts",
      hasData: hasData(attempts),
      Component: RecoveryAttemptsSection,
      priorityWithData: 1,
      priorityWithoutData: 2,
    },
    {
      key: "inheritors",
      hasData: hasData(inheritor),
      Component: InheritorSection,
      priorityWithData: 2,
      priorityWithoutData: 3,
    },
    {
      key: "friendGroups",
      hasData: hasData(friendGroups),
      Component: FriendGroupsSection,
      priorityWithData: 3,
      priorityWithoutData: 1,
    },
  ];

  const sorted = [...sectionConfigs].sort((a, b) => {
    // Data-bearing sections first
    if (a.hasData !== b.hasData) {
      return a.hasData ? -1 : 1;
    }
    // Same group: sort by the corresponding priority
    const pa = a.hasData ? a.priorityWithData : a.priorityWithoutData;
    const pb = b.hasData ? b.priorityWithData : b.priorityWithoutData;
    return pa - pb;
  });

  return (
    <>
      {sorted.map(({ key, Component }) => (
        <Component key={key} />
      ))}
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
