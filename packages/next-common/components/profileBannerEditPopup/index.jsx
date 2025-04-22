import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import ProfileBannerEditPopupContent from "./content";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";

export default function ProfileBannerEditPopup({ onClose = noop }) {
  const { isProxyAccount } = useAvatarPermissionsContext();
  const title = `Set Banner${isProxyAccount ? " As Proxy" : ""}`;

  return (
    <SignerPopupWrapper>
      <Popup title={title} onClose={onClose}>
        <ProfileBannerEditPopupContent closePopup={onClose} />
      </Popup>
    </SignerPopupWrapper>
  );
}
