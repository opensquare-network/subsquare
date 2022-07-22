import React from "react";
import styled, { css } from "styled-components";
import Button from "../button";
import useDarkMode from "../../utils/hooks/useDarkMode";

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      button {
        :hover {
          background: #272a3a;
        }
      }
    `}
`;

export default function VoteButton({ onClick, disabled, isSubmitting }) {
  const [theme] = useDarkMode();
  return (
    <ButtonWrapper theme={theme}>
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
