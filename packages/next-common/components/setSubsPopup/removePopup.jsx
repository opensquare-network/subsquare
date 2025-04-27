import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import RemoveSubPopupContent from "./removeSub";

export default function RemoveSubPopup(props) {
  return (
    <SignerPopupWrapper {...props}>
      <Popup title="Remove Sub" {...props}>
        <RemoveSubPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
