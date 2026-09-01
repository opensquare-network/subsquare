import React from "react";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import LoadingButton from "next-common/lib/button/loading";
import useTxSubmission from "./useTxSubmission";
import { usePopupOnClose } from "next-common/context/popup";

export default function TxSubmissionButton({
  api,
  loading = false,
  loadingText,
  disabled = false,
  getTxFunc = noop,
  title = "Submit",
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onCancelled = noop,
  onTxError = noop,
  onTxStart = noop,
  autoClose = true,
}) {
  const onClose = usePopupOnClose();
  const { isSubmitting, isWrapping, doSubmit } = useTxSubmission({
    api,
    getTxFunc,
    onFinalized,
    onInBlock,
    onCancelled,
    onTxError,
    onTxStart,
    onSubmitted: () => {
      onSubmitted();
      if (autoClose) {
        onClose();
      }
    },
  });

  const isLoading = isSubmitting || loading || isWrapping;

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

export function useTxSubmissionButton({
  loadingText,
  disabled = false,
  getTxFunc = noop,
  title = "Submit",
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  onCancelled = noop,
  onTxError = noop,
  onTxStart = noop,
}) {
  const { isSubmitting, isWrapping, doSubmit } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onInBlock,
    onSubmitted,
    onCancelled,
    onTxError,
    onTxStart,
  });

  return {
    isWrapping,
    isLoading: isSubmitting,
    component: (
      <div className="flex justify-end">
        {isSubmitting && loadingText ? (
          <LoadingButton>{loadingText}</LoadingButton>
        ) : (
          <PrimaryButton
            loading={isSubmitting || isWrapping}
            onClick={doSubmit}
            disabled={disabled}
          >
            {title}
          </PrimaryButton>
        )}
      </div>
    ),
  };
}
