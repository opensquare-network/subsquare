import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "next-common/components/fellowship/core/batchBump/popupContent";
import TitleSuffix from "next-common/components/titleSuffix";
import useExpiredMembers from "../../hooks/useExpiredMembers";

export default function BatchBumpPopup(props) {
  const { expiredMembers, isLoading } = useExpiredMembers();

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
