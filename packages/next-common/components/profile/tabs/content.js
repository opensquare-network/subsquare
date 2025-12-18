import React from "react";
import Posted from "../posted";
import VotingHistory from "../votingHistory";
import ProfileMultisigs from "../multisigs";
import ProfileDelegation from "../delegation";
import ProfileDeposits from "../deposits";
import ProfileTransfers from "../transfers";
import ProfileIdentity from "../identity";
import { usePathname } from "next/navigation";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/mixedChainUtil";
import ProfileFellowship from "../fellowship";
import ProfileProxy from "../proxy";
import ProfileTreasury from "../treasury";
import CollectivesProvider from "next-common/context/collectives/collectives";
import ProfileAssets from "next-common/components/profile/assets";
import ProfileForeignAssets from "next-common/components/profile/foreignAssets";
import ProfileHydrationAssets from "next-common/components/profile/hydrationAssets";

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
    return <ProfileIdentity />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/assets`)) {
    return (
      <div className="flex flex-col gap-[16px]">
        <ProfileAssets />
        <ProfileForeignAssets />
        <ProfileHydrationAssets />
      </div>
    );
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/fellowship`)) {
    return (
      <CollectivesProvider section="fellowship">
        <ProfileFellowship />
      </CollectivesProvider>
    );
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/ambassador`)) {
    return (
      <CollectivesProvider section="ambassador">
        <ProfileFellowship />
      </CollectivesProvider>
    );
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/posted`)) {
    return <Posted />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/proxies`)) {
    return <ProfileProxy />;
  } else if (pathname.startsWith(`/user/${maybeEvmAddress}/treasury`)) {
    return <ProfileTreasury />;
  }

  return <Posted />;
}
