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
  disabled: _disabled,
}) {
  const disabled = balanceInsufficient || _disabled;

  return (
    <ButtonWrapper>
      {balanceInsufficient || disabled ? (
        <SecondaryButton disabled>Submit</SecondaryButton>
      ) : (
        <SecondaryButton isLoading={isSubmitting} onClick={onClick}>
          Submit
        </SecondaryButton>
      )}
    </ButtonWrapper>
  );
}
