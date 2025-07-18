import Popup from "../popup/wrapper/Popup";
import { noop } from "lodash-es";
import ImportMultisigContent from "./content";

export default function ImportMultisig({ onClose = noop, parentClose = noop }) {
  return (
    <Popup title="Import Multisig" onClose={onClose} className="max-h-[76vh]">
      <ImportMultisigContent
        closeAll={() => {
          onClose?.();
          parentClose?.();
        }}
      />
    </Popup>
  );
}
