import React, { useContext } from "react";
import styled from "styled-components";
import useDeposit from "./useDeposit";
import { StateContext } from "./stateContext";
import SecondaryButton from "../../../buttons/secondaryButton";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function SubmitButton({ chain, onClick, depositRequired }) {
  const { balanceInsufficient } = useDeposit(chain, depositRequired);
  const { isSubmitting } = useContext(StateContext);

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
