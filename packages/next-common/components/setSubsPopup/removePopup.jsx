import WindowSizeProvider from "next-common/context/windowSize";
import Popup from "../popup/wrapper/Popup";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";
import RemoveSubPopupContent from "./removeSub";

export default function RemoveSubPopup(props) {
  return (
    <SignerPopupWrapper {...props}>
      <Popup title="Remove Sub" {...props}>
        <WindowSizeProvider>
          <RemoveSubPopupContent />
        </WindowSizeProvider>
      </Popup>
    </SignerPopupWrapper>
  );
}
