import React from "react";
import { VoteEnum } from "../../utils/voteEnum";
import { ButtonWrapper } from "./styled";
import SuccessButton from "next-common/lib/button/success";
import DangerButton from "next-common/lib/button/danger";

export default function VoteButton({
  disabled,
  loadingState,
  isLoading,
  doVote,
}) {
  return (
    <ButtonWrapper>
      <DangerButton
        onClick={() => doVote(false)}
        loading={isLoading && loadingState === VoteEnum.Nay}
        disabled={disabled || (isLoading && loadingState === VoteEnum.Aye)}
      >
        Nay
      </DangerButton>
      <SuccessButton
        onClick={() => doVote(true)}
        loading={isLoading && loadingState === VoteEnum.Aye}
        disabled={disabled || (isLoading && loadingState === VoteEnum.Nay)}
      >
        Aye
      </SuccessButton>
    </ButtonWrapper>
  );
}
