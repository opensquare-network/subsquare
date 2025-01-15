import PopupWithSigner from "next-common/components/popupWithSigner";
import useDemotionExpiredMembers from "./useDemotionExpiredMembers";
import PopupContent from "./popupContent";
import TitleSuffix from "next-common/components/titleSuffix";

export default function BatchBumpPopup(props) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers();

  return (
    <PopupWithSigner
      title={
        <span>
          Demote Members
          <TitleSuffix suffix={expiredMembers?.length} />
        </span>
      }
      {...props}
    >
      <PopupContent expiredMembers={expiredMembers} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
