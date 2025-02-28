import PopupWithSigner from "next-common/components/popupWithSigner";
import useDemotionExpiredMembers from "./useDemotionExpiredMembers";
import PopupContent from "./popupContent";
import TitleSuffix from "next-common/components/titleSuffix";
import { useCallback } from "react";
import fetchFellowshipCoreMembers2Times from "./fetchFellowshipCoreMembers2Times";
import useFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFellowshipCoreMembers";

export default function BatchBumpPopup({ isCandidate, ...props }) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers({
    isCandidate,
  });
  const { fetch } = useFellowshipCoreMembers();

  const onInBlock = useCallback(async () => {
    try {
      await fetchFellowshipCoreMembers2Times(fetch);
    } catch (error) {
      throw new Error("Failed to update fellowship core members:", error);
    }
  }, [fetch]);

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
