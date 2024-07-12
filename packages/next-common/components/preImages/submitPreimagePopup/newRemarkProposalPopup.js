import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo, useState } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import EditorField from "next-common/components/popup/fields/editorField";
import Popup from "next-common/components/popup/wrapper/Popup";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";

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
  const [remark, setRemark] = useState("");
  const { notePreimageTx } = useRemarkNotePreimageTx(remark);

  return (
    <Popup title="New Remark Proposal" onClose={onClose} wide>
      <SignerWithBalance title="Origin" />
      <EditorField title="Remark" content={remark} setContent={setRemark} />
      <div className="flex justify-end">
        <TxSubmissionButton
          getTxFunc={() => notePreimageTx}
          onClose={onClose}
        />
      </div>
    </Popup>
  );
}
