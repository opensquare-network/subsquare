import { useRouter } from "next/router";
import { useContextApi } from "next-common/context/api";
import useToBeAwarded from "next-common/hooks/useToBeAwarded";

export default function useBeAwardedAPI() {
  const router = useRouter();
  const api = useContextApi();

  const isCommunityTreasuryPage = router.pathname.startsWith(
    "/community-treasury",
  );
  const toBeAwardedAPI = isCommunityTreasuryPage
    ? api?.query?.communityTreasury
    : api?.query?.treasury;
  const toBeAwarded = useToBeAwarded(toBeAwardedAPI);

  return toBeAwarded;
}
