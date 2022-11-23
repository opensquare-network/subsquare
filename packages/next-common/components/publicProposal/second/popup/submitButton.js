import React from "react";
import styled from "styled-components";
import SecondaryButton from "../../../buttons/secondaryButton";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function SubmitButton({
  onClick,
  balanceInsufficient,
  isSubmitting,
}) {
  return (
    <ButtonWrapper>
      {balanceInsufficient ? (
        <SecondaryButton disabled>Submit</SecondaryButton>
      ) : (
        <SecondaryButton isLoading={isSubmitting} onClick={onClick}>
          Submit
        </SecondaryButton>
      )}
    </ButtonWrapper>
  );
}
