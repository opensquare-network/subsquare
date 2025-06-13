import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import BioEditPopupContent from "./content";
import { useAvatarPermissionsContext } from "next-common/components/profile/header/context/avatarPermissionsContext";

export default function BioEditPopup({ onClose = noop }) {
  const { isProxyAccount } = useAvatarPermissionsContext();
  const title = `Edit Bio${isProxyAccount ? " As Proxy" : ""}`;

  return (
    <SignerPopupWrapper>
      <Popup title={title} onClose={onClose}>
        <BioEditPopupContent closePopup={onClose} />
      </Popup>
    </SignerPopupWrapper>
  );
}
