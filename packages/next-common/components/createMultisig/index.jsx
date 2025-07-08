import { noop } from "lodash-es";
import CreateMultisigContent from "./content";
import PopupWithSigner from "../popupWithSigner";

export default function CreateMultisigPopup({ onClose = noop }) {
  return (
    <PopupWithSigner title="Create Multisig" onClose={onClose}>
      <CreateMultisigContent />
    </PopupWithSigner>
  );
}
