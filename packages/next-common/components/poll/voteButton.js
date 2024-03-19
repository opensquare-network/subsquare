import React from "react";
import PrimaryButton from "next-common/lib/button/primary";
import { PopupButtonWrapper } from "../popup/wrapper";

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  return (
    <PopupButtonWrapper>
      {disabled ? (
        <PrimaryButton disabled>Vote</PrimaryButton>
      ) : (
        <PrimaryButton
          loading={isSubmitting}
          onClick={onClick}
          disabled={disabled}
        >
          Vote
        </PrimaryButton>
      )}
    </PopupButtonWrapper>
  );
}
