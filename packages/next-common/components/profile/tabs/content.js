import Posted from "next-common/components/profile/posted";
import VotingHistory from "next-common/components/profile/votingHistory";
import React from "react";
import ProfileMultisigs from "../multisigs";
import { usePathname } from "next/navigation";
import ProfileDeposits from "next-common/components/profile/deposits";

export default function useProfileTabContent(id) {
  const pathname = usePathname();

  if (pathname.startsWith(`/user/${id}/votes`)) {
    return <VotingHistory />;
  } else if (pathname.startsWith(`/user/${id}/deposits`)) {
    return <ProfileDeposits />;
  } else if (pathname.startsWith(`/user/${id}/multisigs`)) {
    return <ProfileMultisigs />;
  }

  return <Posted />;
}
