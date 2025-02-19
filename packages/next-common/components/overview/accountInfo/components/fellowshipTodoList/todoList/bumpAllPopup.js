import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "next-common/components/fellowship/core/batchBump/popupContent";
import TitleSuffix from "next-common/components/titleSuffix";
import { useDemotionExpiredMembers } from "../context/hooks/expired";

export default function BatchBumpPopup(props) {
  const { members, isLoading } = useDemotionExpiredMembers();

  return (
    <PopupWithSigner
      title={
        <span>
          Demote Members
          <TitleSuffix suffix={members?.length} />
        </span>
      }
      {...props}
    >
      <PopupContent expiredMembers={members} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
