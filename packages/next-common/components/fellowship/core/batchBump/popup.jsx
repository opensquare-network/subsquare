import PopupWithSigner from "next-common/components/popupWithSigner";
import useDemotionExpiredMembers from "./useDemotionExpiredMembers";
import PopupContent from "./popupContent";

export default function BatchBumpPopup(props) {
  const { expiredMembers = [], isLoading } = useDemotionExpiredMembers();

  return (
    <PopupWithSigner
      title={
        <span>
          Bump Members
          <span className="ml-1 text14Medium text-textTertiary">
            {expiredMembers?.length}
          </span>
        </span>
      }
      {...props}
    >
      <PopupContent expiredMembers={expiredMembers} isLoading={isLoading} />
    </PopupWithSigner>
  );
}
