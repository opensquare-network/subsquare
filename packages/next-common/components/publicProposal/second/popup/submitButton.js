import React from "react";
import SecondaryButton from "../../../buttons/secondaryButton";
import { PopupButtonWrapper } from "../../../popup/wrapper";

export default function SubmitButton({
  onClick,
  balanceInsufficient,
  isSubmitting,
  disabled: _disabled,
}) {
  const disabled = balanceInsufficient || _disabled;

  return (
    <PopupButtonWrapper>
      {balanceInsufficient || disabled ? (
        <SecondaryButton disabled>Submit</SecondaryButton>
      ) : (
        <SecondaryButton isLoading={isSubmitting} onClick={onClick}>
          Submit
        </SecondaryButton>
      )}
    </PopupButtonWrapper>
  );
}
