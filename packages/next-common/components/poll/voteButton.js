import React from "react";
import styled from "styled-components";
import SecondaryButton from "../buttons/secondaryButton";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  return (
    <ButtonWrapper>
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
    </ButtonWrapper>
  );
}
