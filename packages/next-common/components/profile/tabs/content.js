import React from "react";
import Posted from "../posted";
import VotingHistory from "../votingHistory";
import ProfileMultisigs from "../multisigs";
import ProfileDelegation from "../delegation";
import ProfileDeposits from "../deposits";
import ProfileTransfers from "../transfers";
import ProfileIdentityTimeline from "../identityTimeline";
import { usePathname } from "next/navigation";
import { usePageProps } from "next-common/context/page";
import { tryConvertToEvmAddress } from "next-common/utils/hydradxUtil";

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
  } else if (
    pathname.startsWith(`/user/${maybeEvmAddress}/identity-timeline`)
  ) {
    return <ProfileIdentityTimeline />;
  }

  return <Posted />;
}
