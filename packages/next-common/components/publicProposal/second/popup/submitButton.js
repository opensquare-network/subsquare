import React from "react";
import PrimaryButton from "../../../buttons/primaryButton";
import { PopupButtonWrapper } from "../../../popup/wrapper";

export default function SubmitButton({
  onClick,
  balanceInsufficient,
  isSubmitting,
  disabled,
}) {
  return (
    <PopupButtonWrapper>
      {balanceInsufficient || disabled ? (
        <PrimaryButton disabled>Submit</PrimaryButton>
      ) : (
        <PrimaryButton isLoading={isSubmitting} onClick={onClick}>
          Submit
        </PrimaryButton>
      )}
    </PopupButtonWrapper>
  );
}
