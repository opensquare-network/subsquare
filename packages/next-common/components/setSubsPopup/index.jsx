import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import SetSubsPopupContent from "./content";

export default function SetSubsPopup(props) {
  return (
    <SignerPopupWrapper {...props}>
      <Popup title="Set Subs" {...props}>
        <SetSubsPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
