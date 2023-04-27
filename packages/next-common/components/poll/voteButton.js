import React from "react";
import SecondaryButton from "../buttons/secondaryButton";
import { PopupButtonWrapper } from "../popup/wrapper";

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  return (
    <PopupButtonWrapper>
      {disabled ? (
        <SecondaryButton disabled>Vote</SecondaryButton>
      ) : (
        <SecondaryButton
          isLoading={isSubmitting}
          onClick={onClick}
          disabled={disabled}
        >
          Vote
        </SecondaryButton>
      )}
    </PopupButtonWrapper>
  );
}
