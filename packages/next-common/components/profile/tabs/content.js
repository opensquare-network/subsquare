import React from "react";
import Posted from "../posted";
import VotingHistory from "../votingHistory";
import ProfileMultisigs from "../multisigs";
import ProfileDelegation from "../delegation";
import ProfileDeposits from "../deposits";
import ProfileTransfers from "../transfers";
import ProfileIdentityTimeline from "../identityTimeline";
import ProfileAssets from "../assets";
import { usePathname } from "next/navigation";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import isAssetHub from "next-common/utils/isAssetHub";
import ProfileFellowshipCore from "../fellowship/core";
import ProfileFellowshipSalary from "../fellowship/salary";
import CollectivesProvider from "next-common/context/collectives/collectives";
import { useProfileCollectivesSection } from "./useProfileCollectivesSection";

export default function useProfileTabContent() {
  const { id } = usePageProps();
  const pathname = usePathname();
  const section = useProfileCollectivesSection();

  if (isAssetHub()) {
    return <ProfileAssets />;
  }

  const maybeEvmAddress = tryConvertToEvmAddress(id);

  if (pathname.startsWith(`/user/${maybeEvmAddress}/votes`)) {
    return <VotingHistory />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/deposits`)) {
    return <ProfileDeposits />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/multisigs`)) {
    return <ProfileMultisigs />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/delegation`)) {
    return <ProfileDelegation />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/transfers`)) {
    return <ProfileTransfers />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/identity`)) {
    return <ProfileIdentityTimeline />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/assets`)) {
    return <ProfileAssets />;
  } else if (
    pathname === `/user/${maybeEvmAddress}/fellowship` ||
    pathname === `/user/${maybeEvmAddress}/ambassador`
  ) {
    return (
      <CollectivesProvider section={section}>
        <ProfileFellowshipCore />
      </CollectivesProvider>
    );
  } else if (
    pathname === `/user/${maybeEvmAddress}/fellowship/salary` ||
    pathname === `/user/${maybeEvmAddress}/ambassador/salary`
  ) {
    return (
      <CollectivesProvider section={section}>
        <ProfileFellowshipSalary />
      </CollectivesProvider>
    );
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/posted`)) {
    return <Posted />;
  }

  return <Posted />;
}
