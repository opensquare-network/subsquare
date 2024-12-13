import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "./notePreimageButton";
import useReferendumIndexField from "./fields/useReferendumIndexField";
import { isNil } from "lodash-es";
import { usePopupParams } from "next-common/components/popupWithSigner/context";

export function useCancelReferendumNotePreimageTx(referendumIndex) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || isNil(referendumIndex)) {
      return {};
    }

    try {
      const proposal = api.tx.referenda.cancel(referendumIndex);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, referendumIndex]);
}

export default function CancelReferendumPopup() {
  const { onClose } = usePopupParams();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField();

  const { notePreimageTx } = useCancelReferendumNotePreimageTx(referendumIndex);

  return (
    <Popup title="Cancel a referendum" onClose={onClose}>
      <SignerWithBalance />
      {referendumIndexField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
