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
import ProfileFellowshipCore from "../fellowship/core";
import ProfileFellowshipSalary from "../fellowship/salary";
import ProfileProxy from "../proxy";
import CollectivesProvider from "next-common/context/collectives/collectives";

export default function useProfileTabContent() {
  const { id } = usePageProps();
  const pathname = usePathname();

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
  } else if (pathname === `/user/${maybeEvmAddress}/fellowship`) {
    return (
      <CollectivesProvider section="fellowship">
        <ProfileFellowshipCore />
      </CollectivesProvider>
    );
  } else if (pathname === `/user/${maybeEvmAddress}/ambassador`) {
    return (
      <CollectivesProvider section="ambassador">
        <ProfileFellowshipCore />
      </CollectivesProvider>
    );
  } else if (pathname === `/user/${maybeEvmAddress}/fellowship/salary`) {
    return (
      <CollectivesProvider section="fellowship">
        <ProfileFellowshipSalary />
      </CollectivesProvider>
    );
  } else if (pathname === `/user/${maybeEvmAddress}/ambassador/salary`) {
    return (
      <CollectivesProvider section="ambassador">
        <ProfileFellowshipSalary />
      </CollectivesProvider>
    );
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/posted`)) {
    return <Posted />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/proxies`)) {
    return <ProfileProxy />;
  }

  return <Posted />;
}
