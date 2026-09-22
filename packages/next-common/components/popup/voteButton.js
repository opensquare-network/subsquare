import React from "react";
import { VoteEnum } from "../../utils/voteEnum";
import { ButtonWrapper } from "./styled";
import SuccessButton from "next-common/lib/button/success";
import DangerButton from "next-common/lib/button/danger";
import WatchOnlyTooltip from "next-common/components/watchOnly/tooltip";
import { useIsWatchOnly } from "next-common/context/connectedAccount";

export default function VoteButton({
  disabled,
  loadingState,
  isLoading,
  doVote,
}) {
  const isWatchOnly = useIsWatchOnly();
  const isDisabled = disabled || isWatchOnly;

  return (
    <ButtonWrapper>
      <WatchOnlyTooltip>
        <DangerButton
          onClick={() => doVote(false)}
          loading={isLoading && loadingState === VoteEnum.Nay}
          disabled={isDisabled || (isLoading && loadingState === VoteEnum.Aye)}
        >
          Nay
        </DangerButton>
      </WatchOnlyTooltip>
      <WatchOnlyTooltip>
        <SuccessButton
          onClick={() => doVote(true)}
          loading={isLoading && loadingState === VoteEnum.Aye}
          disabled={isDisabled || (isLoading && loadingState === VoteEnum.Nay)}
        >
          Aye
        </SuccessButton>
      </WatchOnlyTooltip>
    </ButtonWrapper>
  );
}
