import React from "react";
import PrimaryButton from "../buttons/primaryButton";
import { PopupButtonWrapper } from "../popup/wrapper";

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  return (
    <PopupButtonWrapper>
      {disabled ? (
        <PrimaryButton disabled>Vote</PrimaryButton>
      ) : (
        <PrimaryButton
          isLoading={isSubmitting}
          onClick={onClick}
          disabled={disabled}
        >
          Vote
        </PrimaryButton>
      )}
    </PopupButtonWrapper>
  );
}
