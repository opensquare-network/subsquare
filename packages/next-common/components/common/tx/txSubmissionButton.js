import React from "react";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import LoadingButton from "next-common/lib/button/loading";
import useTxSubmission from "./useTxSubmission";

export default function TxSubmissionButton({
  loading = false,
  loadingText,
  disabled = false,
  getTxFunc = noop,
  title = "Submit",
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onClose = noop,
}) {
  const { isSubmitting, doSubmit } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onInBlock,
    onSubmitted,
    onClose,
  });

  const isLoading = isSubmitting || loading;

  return (
    <div className="flex justify-end">
      {isLoading && loadingText ? (
        <LoadingButton>{loadingText}</LoadingButton>
      ) : (
        <PrimaryButton
          loading={isLoading}
          onClick={doSubmit}
          disabled={disabled}
        >
          {title}
        </PrimaryButton>
      )}
    </div>
  );
}
