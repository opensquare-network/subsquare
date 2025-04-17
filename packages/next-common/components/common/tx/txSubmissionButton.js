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
  const { isSubmitting, doSubmit } = useTxSubmission({
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

export function useTxSubmissionButton({
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
  const { isSubmitting, doSubmit } = useTxSubmission({
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

  const isLoading = isSubmitting || loading;

  return {
    isLoading,
    component: (
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
    ),
  };
}
