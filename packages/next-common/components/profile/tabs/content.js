import React from "react";
import Posted from "next-common/components/profile/posted";
import VotingHistory from "next-common/components/profile/votingHistory";
import ProfileMultisigs from "../multisigs";
import { usePathname } from "next/navigation";
import ProfileDeposits from "next-common/components/profile/deposits";
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
  }

  return <Posted />;
}
