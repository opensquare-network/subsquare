import React from "react";
import styled from "styled-components";
import Button from "../button";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  return (
    <ButtonWrapper>
      {disabled ? (
        <Button disabled>Vote</Button>
      ) : (
        <Button secondary isLoading={isSubmitting} onClick={onClick}>
          Vote
        </Button>
      )}
    </ButtonWrapper>
  );
}
