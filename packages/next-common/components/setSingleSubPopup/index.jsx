import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import SetSingleSubPopupContent from "./content";

export default function SetSingleSubPopup(props) {
  return (
    <SignerPopupWrapper {...props}>
      <Popup title="Add Sub Identity" {...props}>
        <SetSingleSubPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}