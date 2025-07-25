import { noop } from "lodash-es";
import CreateMultisigContent from "./content";
import PopupWithSigner from "../popupWithSigner";
import { SignatoriesProvider } from "./context/signatories";
import { useMultisigAccounts } from "../multisigs/context/accountsContext";

export default function CreateMultisigPopup({
  onClose = noop,
  onOpenImportPopup = noop,
}) {
  const { refresh } = useMultisigAccounts();
  return (
    <PopupWithSigner
      title="Create Multisig"
      onClose={onClose}
      onOpenImportPopup={onOpenImportPopup}
      onRefresh={refresh}
    >
      <SignatoriesProvider>
        <CreateMultisigContent />
      </SignatoriesProvider>
    </PopupWithSigner>
  );
}
