import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { usePopupOnClose } from "next-common/context/popup";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export default function NotePreimageButton({ notePreimageTx }) {
  const dispatch = useDispatch();
  const onClose = usePopupOnClose();

  return (
    <TxSubmissionButton
      disabled={!notePreimageTx}
      getTxFunc={() => notePreimageTx}
      onClose={onClose}
      onInBlock={() => {
        dispatch(newSuccessToast("Preimage created"));
        dispatch(incPreImagesTrigger());
      }}
    />
  );
}
