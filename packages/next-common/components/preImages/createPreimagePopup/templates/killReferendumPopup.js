import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "../notePreimageButton";
import useReferendumIndexField from "../fields/useReferendumIndexField";
import { isNil } from "lodash-es";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import InsufficientBalanceTips from "next-common/components/summary/newProposalQuickStart/common/insufficientBalanceTips";
import ExtrinsicInfo from "../../newPreimagePopup/info";

export function useKillReferendumNotePreimageTx(referendumIndex) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || isNil(referendumIndex) || referendumIndex === "") {
      return {};
    }

    try {
      const proposal = api.tx.referenda.kill(referendumIndex);
      return getState(api, proposal);
    } catch {
      return {};
    }
  }, [api, referendumIndex]);
}

export default function KillReferendumPopup() {
  const { onClose } = usePopupParams();
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField();

  const { notePreimageTx, encodedLength, encodedProposal, encodedHash } =
    useKillReferendumNotePreimageTx(referendumIndex);

  return (
    <Popup title="Kill a referendum" onClose={onClose}>
      <SignerWithBalance />
      {referendumIndexField}
      {encodedProposal && (
        <ExtrinsicInfo
          preimageHash={encodedHash}
          callData={encodedProposal}
          preimageLength={encodedLength || 0}
        />
      )}
      <InsufficientBalanceTips byteLength={encodedLength} onlyPreimage />
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
