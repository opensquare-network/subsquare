import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import Popup from "next-common/components/popup/wrapper/Popup";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";

export default function VoteSuccessfulPopup({ addressVote, onClose }) {
  return (
    <Popup title="Referendum vote" onClose={onClose}>
      <VoteSuccessfulWrapper onClose={onClose}>
        <VoteFor>
          <span>Vote for</span>
        </VoteFor>
        <VoteItem vote={addressVote} />
      </VoteSuccessfulWrapper>
    </Popup>
  );
}
