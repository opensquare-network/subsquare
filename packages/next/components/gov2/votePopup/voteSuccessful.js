import { normalizeOnchainVote } from "next-common/utils/vote";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";
import Popup from "next-common/components/popup/wrapper/Popup";
import Delegations from "../sidebar/tally/myVote/info/delegations";
import { isNil } from "lodash-es";

export default function VoteSuccessfulPopup({
  addressVote,
  addressDelegations,
  onClose,
}) {
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
          {!isNil(addressDelegations) && (
            <Delegations delegations={addressDelegations} />
          )}
        </div>
      </VoteSuccessfulWrapper>
    </Popup>
  );
}
