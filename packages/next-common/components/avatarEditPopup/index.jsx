import { noop } from "lodash-es";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import AvatarEditPopupContent from "./content";
export default function AvatarEditPopup({
  onClose = noop,
  isProxy = false,
  title = "Set Avatar",
}) {
  return (
    <SignerPopupWrapper>
      <Popup title={title} onClose={onClose}>
        <AvatarEditPopupContent isProxy={isProxy} />
      </Popup>
    </SignerPopupWrapper>
  );
}
