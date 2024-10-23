import Popup from "../popup/wrapper/Popup";
import { ProxiedAccounts } from "../switchSignerPopup";
import { noop } from "lodash-es";
import SignerPopupWrapper from "../popupWithSigner/signerPopupWrapper";

export default function SelectProxyAccountPopup({ onClose, onSelect = noop }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Select Address" className="w-[640px]" onClose={onClose}>
        <div className="flex flex-col gap-[24px]">
          <ProxiedAccounts onSelect={onSelect} />
        </div>
      </Popup>
    </SignerPopupWrapper>
  );
}
