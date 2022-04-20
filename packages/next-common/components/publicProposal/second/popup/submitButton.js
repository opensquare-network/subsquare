import React from "react";
import styled from "styled-components";
import Button from "../../../button";
import useDeposit from "./useDeposit";
import { useContext } from "react";
import { StateContext } from "./stateContext";

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
        <Button disabled>Submit</Button>
      ) : (
        <Button secondary isLoading={isSubmitting} onClick={onClick}>
          Submit
        </Button>
      )}
    </ButtonWrapper>
  );
}
