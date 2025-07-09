import Popup from "../popup/wrapper/Popup";
import { noop } from "lodash-es";
import ImportMultisigContent from "./content";

export default function ImportMultisig({ onClose = noop }) {
  return (
    <Popup title="Import Multisig" onClose={onClose}>
      <ImportMultisigContent />
    </Popup>
  );
}
