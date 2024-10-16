import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useMemo } from "react";
import { getState } from "next-common/components/preImages/newPreimagePopup";
import { useContextApi } from "next-common/context/api";
import Popup from "next-common/components/popup/wrapper/Popup";
import NotePreimageButton from "./notePreimageButton";
import useReferendumIndexField from "./fields/useReferendumIndexField";
import { isNil } from "lodash-es";

export function useKillReferendumNotePreimageTx(referendumIndex) {
  const api = useContextApi();

  return useMemo(() => {
    if (!api || isNil(referendumIndex)) {
      return {};
    }

    try {
      const proposal = api.tx.referenda.kill(referendumIndex);
      return getState(api, proposal);
    } catch (e) {
      return {};
    }
  }, [api, referendumIndex]);
}

export default function KillReferendumPopup({ onClose }) {
  const { value: referendumIndex, component: referendumIndexField } =
    useReferendumIndexField();

  const { notePreimageTx } = useKillReferendumNotePreimageTx(referendumIndex);

  return (
    <Popup
      title="Kill a referendum"
      className="!w-[640px]"
      onClose={onClose}
      wide
    >
      <SignerWithBalance />
      {referendumIndexField}
      <div className="flex justify-end">
        <NotePreimageButton notePreimageTx={notePreimageTx} />
      </div>
    </Popup>
  );
}
