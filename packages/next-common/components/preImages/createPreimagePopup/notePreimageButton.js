import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useSmartTxToast } from "next-common/hooks/useMultisigTx";
import { incPreImagesTrigger } from "next-common/store/reducers/preImagesSlice";
import { useDispatch } from "react-redux";

export default function NotePreimageButton({ notePreimageTx }) {
  const dispatch = useDispatch();
  const { smartToastAtInBlock } = useSmartTxToast();
  return (
    <TxSubmissionButton
      disabled={!notePreimageTx}
      getTxFunc={() => notePreimageTx}
      onInBlock={() => {
        smartToastAtInBlock("Preimage created");
        dispatch(incPreImagesTrigger());
      }}
    />
  );
}
