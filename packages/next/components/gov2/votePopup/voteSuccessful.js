import { normalizeOnchainVote } from "next-common/utils/vote";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";
import Popup from "next-common/components/popup/wrapper/Popup";

export default function VoteSuccessfulPopup({ addressVote, onClose }) {
  const votes = normalizeOnchainVote(addressVote);
  let voteType = "Standard";
  if (addressVote.split) {
    voteType = "Split";
  } else if (addressVote.splitAbstain) {
    voteType = "SplitAbstain";
  }

  return (
    <Popup title="Referendum vote" onClose={onClose}>
      <VoteSuccessfulWrapper onClose={onClose}>
        <VoteFor>
          <span>Vote for</span>
          <span className="text-textTertiary">{voteType}</span>
        </VoteFor>
        <div className="flex flex-col">
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
        </div>
      </VoteSuccessfulWrapper>
    </Popup>
  );
}
