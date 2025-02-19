import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "next-common/components/fellowship/core/batchBump/popupContent";
import TitleSuffix from "next-common/components/titleSuffix";
import { useDemotionExpiredCandidates } from "../../context/hooks/expired";

export default function CandidateBatchBumpPopup(props) {
  const { expiredMembers, isLoading } = useDemotionExpiredCandidates();

  return (
    <PopupWithSigner
      title={
        <span>
          Offboard Candidates
          <TitleSuffix suffix={expiredMembers?.length} />
        </span>
      }
      {...props}
    >
      <PopupContent expiredMembers={expiredMembers} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
