import {
  StatusWrapper,
  VotingStatusContent,
} from "next-common/components/popup/styled";
import ValueDisplay from "next-common/components/valueDisplay";
import { toPrecision } from "next-common/utils";
import PopupLabel from "next-common/components/popup/label";
import VoteStatusBox from "next-common/components/popup/voteStatusBox";
import { useChainSettings } from "next-common/context/chain";

export default function SplitAbstainVoteStatus({
  title = "Current voting",
  addressVoteSplit,
}) {
  const node = useChainSettings();
  const addressVoteSplitAye = addressVoteSplit?.aye;
  const addressVoteSplitNay = addressVoteSplit?.nay;
  const addressVoteSplitAbstain = addressVoteSplit?.abstain;

  return (
    <VotingStatusContent>
      <PopupLabel
        text={title}
        status={"SplitAbstain"}
        tooltip={"Vote for both aye, nay and abstain"}
      />
      <VoteStatusBox aye={true}>
        <ValueDisplay
          value={toPrecision(addressVoteSplitAye, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
      </VoteStatusBox>
      <VoteStatusBox aye={false}>
        <ValueDisplay
          value={toPrecision(addressVoteSplitNay, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
      </VoteStatusBox>
      <StatusWrapper>
        <ValueDisplay
          value={toPrecision(addressVoteSplitAbstain, node.decimals)}
          symbol={node?.voteSymbol || node?.symbol}
        />
        <div className="result">Abstain</div>
      </StatusWrapper>
    </VotingStatusContent>
  );
}
