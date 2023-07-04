import {
  StatusWrapper,
  VotingStatusContent,
} from "next-common/components/popup/styled";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import ValueDisplay from "next-common/components/valueDisplay";
import { addressEllipsis, toPrecision } from "next-common/utils";
import { convictionToLockX } from "utils/referendumUtil";
import { useChainSettings } from "next-common/context/chain";
import Tooltip from "next-common/components/tooltip";
import styled from "styled-components";

const DelegateStatus = styled(StatusWrapper)`
  .light {
    color: var(--textSecondary);
  }
`;

export default function DelegateVoteStatus({
  title = "Current voting",
  addressVoteDelegate,
}) {
  const node = useChainSettings();
  const addressVoteDelegateAye = addressVoteDelegate?.aye;
  const addressVoteDelegateBalance = addressVoteDelegate?.balance;
  const addressVoteDelegateConviction = addressVoteDelegate?.conviction;
  const addressVoteDelegateTarget = addressVoteDelegate?.target;
  const shortAddr = addressEllipsis(addressVoteDelegateTarget);

  return (
    <VotingStatusContent>
      <PopupLabel text={title} />
      <VoteStatusBox aye={addressVoteDelegateAye}>
        <ValueDisplay
          value={toPrecision(addressVoteDelegateBalance, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
        <span>{`(${convictionToLockX(addressVoteDelegateConviction)})`}</span>
      </VoteStatusBox>
      <DelegateStatus>
        <div className="value">
          <span className="light">Delegated to&nbsp;</span>
          {shortAddr}
        </div>
        <div className="result">
          <Tooltip content="Vote by delegating target" />
        </div>
      </DelegateStatus>
    </VotingStatusContent>
  );
}
