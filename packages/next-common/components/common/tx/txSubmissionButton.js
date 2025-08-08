import React from "react";
import { noop } from "lodash-es";
import PrimaryButton from "next-common/lib/button/primary";
import LoadingButton from "next-common/lib/button/loading";
import useTxSubmission from "./useTxSubmission";
import { usePopupOnClose } from "next-common/context/popup";

export default function TxSubmissionButton({
  loading = false,
  loadingText,
  disabled = false,
  getTxFunc = noop,
  title = "Submit",
  onFinalized = noop,
  onInBlock = noop,
  onSubmitted = noop,
  autoClose = true,
}) {
  const onClose = usePopupOnClose();
  const { isSubmitting, isTxLoading, doSubmit } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onInBlock,
    onSubmitted: () => {
      if (autoClose) {
        onClose();
      }
      onSubmitted();
    },
  });

  const isLoading = isSubmitting || loading || isTxLoading;

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
}) {
  const { isSubmitting, isTxLoading, doSubmit } = useTxSubmission({
    getTxFunc,
    onFinalized,
    onInBlock,
    onSubmitted,
  });

  return {
    isTxLoading,
    isLoading: isSubmitting,
    component: (
      <div className="flex justify-end">
        {isSubmitting && loadingText ? (
          <LoadingButton>{loadingText}</LoadingButton>
        ) : (
          <PrimaryButton
            loading={isSubmitting || isTxLoading}
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
