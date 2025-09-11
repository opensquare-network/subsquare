import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import AvatarEditPopupContent from "./content";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";

export default function AvatarEditPopup({ onClose = noop }) {
  const { isProxyAccount } = useAvatarPermissionsContext();
  const title = `Set Avatar${isProxyAccount ? " As Proxy" : ""}`;

  return (
    <SignerPopupWrapper>
      <Popup title={title} onClose={onClose}>
        <AvatarEditPopupContent closePopup={onClose} />
      </Popup>
    </SignerPopupWrapper>
  );
}
