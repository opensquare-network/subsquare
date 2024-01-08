import Posted from "next-common/components/profile/posted";
import VotingHistory from "next-common/components/profile/votingHistory";
import React from "react";
import { useRouter } from "next/router";

export default function useProfileTabContent(id) {
  const router = useRouter();

  if (router.asPath.startsWith(`/user/${id}/votes`)) {
    return <VotingHistory />;
  } else if (router.asPath.startsWith(`/user/${id}/multisigs`)) {
    return null;
  }

  return <Posted />;
}
