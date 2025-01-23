import PopupWithSigner from "next-common/components/popupWithSigner";
import useDemotionExpiredMembers from "./useDemotionExpiredMembers";
import PopupContent from "./popupContent";
import TitleSuffix from "next-common/components/titleSuffix";

export default function BatchBumpPopup({ isCandidate, blockHeight, ...props }) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers({
    isCandidate,
    blockHeight,
  });

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
      <PopupContent expiredMembers={expiredMembers} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
