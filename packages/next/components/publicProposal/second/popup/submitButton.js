import styled from "styled-components";
import Button from "next-common/components/button";
import useDeposit from "./useDeposit";
import { useContext } from "react";
import { StatusContext } from "./stateContext";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function SubmitButton({ chain, onClick, depositRequired }) {
  const { balanceInsufficient } = useDeposit(chain, depositRequired);
  const { isSubmitting } = useContext(StatusContext);

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
