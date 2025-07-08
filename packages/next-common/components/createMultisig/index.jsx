import { noop } from "lodash-es";
import CreateMultisigContent from "./content";
import PopupWithSigner from "../popupWithSigner";
import { SignatoriesProvider } from "./context/signatories";

export default function CreateMultisigPopup({ onClose = noop }) {
  return (
    <PopupWithSigner title="Create Multisig" onClose={onClose}>
      <SignatoriesProvider>
        <CreateMultisigContent />
      </SignatoriesProvider>
    </PopupWithSigner>
  );
}
