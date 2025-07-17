import { useState } from "react";
import dynamicPopup from "next-common/lib/dynamic/popup";
import { usePopupParams } from "../popupWithSigner/context";

const ImportMultisigPopup = dynamicPopup(() =>
  import("next-common/components/importMultisig"),
);

export default function ImportTips() {
  const { onClose } = usePopupParams();
  const [openImportMultisigPopup, setOpenImportMultisigPopup] = useState(false);

  return (
    <>
      <div className="text-textSecondary text14Medium text-center">
        <span
          className="text-theme500 cursor-pointer"
          onClick={() => setOpenImportMultisigPopup(true)}
          role="button"
        >
          Import
        </span>{" "}
        history multisig addresses from explorer API.
      </div>
      {openImportMultisigPopup && (
        <ImportMultisigPopup
          onClose={() => setOpenImportMultisigPopup(false)}
          parentClose={onClose}
          onSubmit={() => setOpenImportMultisigPopup(false)}
        />
      )}
    </>
  );
}
