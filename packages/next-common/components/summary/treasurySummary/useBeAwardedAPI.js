import { useRouter } from "next/router";
import { useContextApi } from "next-common/context/api";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";

export function useIsCommunityTreasuryPage() {
  const router = useRouter();
  return router.pathname.startsWith("/community-treasury");
}

export default function useBeAwardedAPI() {
  const api = useContextApi();

  const isCommunityTreasuryPage = useIsCommunityTreasuryPage();
  const toBeAwardedAPI = isCommunityTreasuryPage
    ? api?.query?.communityTreasury
    : api?.query?.treasury;
  const toBeAwarded = useToBeAwarded(toBeAwardedAPI);

  return toBeAwarded;
}
