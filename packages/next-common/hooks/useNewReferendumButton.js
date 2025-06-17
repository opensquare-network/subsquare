import useTxSubmission from "next-common/components/common/tx/useTxSubmission";
import LoadingPrimaryButton from "next-common/lib/button/loadingPrimary";
import { useNewReferendumTx } from "./useNewReferendumTx";

export default function useNewReferendumButton({
  disabled,
  buttonText = "Submit",
  trackId,
  encodedHash,
  encodedLength,
  enactment,
}) {
  const { getTxFunc, onInBlock, onSubmitted } = useNewReferendumTx({
    trackId,
    encodedHash,
    encodedLength,
    enactment,
  });
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onInBlock,
    onSubmitted,
  });

  return {
    isSubmitting,
    getTxFunc,
    onInBlock,
    doSubmit,
    component: (
      <LoadingPrimaryButton
        disabled={disabled}
        loading={isSubmitting}
        onClick={doSubmit}
      >
        {buttonText}
      </LoadingPrimaryButton>
    ),
  };
}
