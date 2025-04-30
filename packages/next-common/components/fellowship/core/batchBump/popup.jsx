import PopupWithSigner from "next-common/components/popupWithSigner";
import useDemotionExpiredMembers from "./useDemotionExpiredMembers";
import PopupContent from "./popupContent";
import TitleSuffix from "next-common/components/titleSuffix";
import { useCallback } from "react";
import fetchFellowshipCoreMembers2Times from "./fetchFellowshipCoreMembers2Times";
import useFellowshipCoreMembersWithRank from "next-common/hooks/fellowship/core/useFellowshipCoreMembersWithRank";
import { useFellowshipCoreMembers } from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";
import { useFellowshipCollectiveMembers } from "next-common/hooks/fellowship/core/useFellowshipCollectiveMembers";

export default function BatchBumpPopup({ isCandidate, ...props }) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers({
    isCandidate,
  });
  const { fetch: fetchCoreMembersWithRank } =
    useFellowshipCoreMembersWithRank();
  const { fetch: fetchCoreMembers } = useFellowshipCoreMembers();
  const { fetch: fetchRankMembers } = useFellowshipCollectiveMembers();

  const onInBlock = useCallback(async () => {
    try {
      await fetchFellowshipCoreMembers2Times(async () => {
        await fetchCoreMembersWithRank();
        await fetchCoreMembers();
        await fetchRankMembers();
      });
    } catch (error) {
      throw new Error("Failed to update fellowship core members:", error);
    }
  }, [fetchCoreMembersWithRank, fetchCoreMembers, fetchRankMembers]);

  return (
    <PopupWithSigner
      title={
        <span>
          {isCandidate ? "Offboard Candidates" : "Demote Members"}
          <TitleSuffix suffix={expiredMembers?.length} />
        </span>
      }
      {...props}
    >
      <PopupContent
        expiredMembers={expiredMembers}
        isLoading={isLoading}
        onInBlock={onInBlock}
        onFinalized={onInBlock}
      />
    </PopupWithSigner>
  );
}
