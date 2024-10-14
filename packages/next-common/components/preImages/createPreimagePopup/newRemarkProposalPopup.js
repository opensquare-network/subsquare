import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "./notePreimageButton";
import useRemarkField from "./fields/useRemarkField";

export function useRemarkNotePreimageTx(remark) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || !remark) {
      return {};
    }

    try {
      const proposal = api.tx.system.remark(remark);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, remark]);
}

export default function NewRemarkProposalPopup({ onClose }) {
  const { value: remark, component: remarkField } = useRemarkField();
  const { notePreimageTx } = useRemarkNotePreimageTx(remark);

  return (
    <Popup title="New Remark Proposal" onClose={onClose} wide>
      <SignerWithBalance />
      {remarkField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
