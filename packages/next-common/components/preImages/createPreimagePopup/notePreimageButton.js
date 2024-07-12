import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export default function NotePreimageButton({ notePreimageTx, onClose }) {
  const dispatch = useDispatch();

  return (
    <TxSubmissionButton
      getTxFunc={() => notePreimageTx}
      onClose={onClose}
      onInBlock={() => {
        dispatch(newSuccessToast("Preimage created"));
        dispatch(incPreImagesTrigger());
      }}
    />
  );
}
