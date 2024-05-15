import React from "react";
import { emptyFunction } from "next-common/utils";
import PrimaryButton from "next-common/lib/button/primary";
import LoadingButton from "next-common/lib/button/loading";
import useTxSubmission from "./useTxSubmission";

export default function TxSubmissionButton({
  loading = false,
  loadingText,
  disabled = false,
  getTxFunc = emptyFunction,
  title = "Submit",
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
  onSubmitted = emptyFunction,
  onClose = emptyFunction,
}) {
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onInBlock,
    onSubmitted,
    onClose,
  });

  return (
    <div className="flex justify-end">
      {(isSubmitting || loading) && loadingText ? (
        <LoadingButton>{loadingText}</LoadingButton>
      ) : (
        <PrimaryButton
          loading={isSubmitting}
          onClick={doSubmit}
          disabled={disabled}
        >
          {title}
        </PrimaryButton>
      )}
    </div>
  );
}
