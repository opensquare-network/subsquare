import { Aye, Nay } from "next-common/components/profile/votingHistory/common";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";
import Popup from "../popup/wrapper/Popup";

export function VoteItem({ vote }) {
  if (!vote) {
    return null;
  }

  const [, aye] = vote;

  let icon = null;
  if (aye) {
    icon = <Aye />;
  } else {
    icon = <Nay />;
  }

  return (
    <div className="flex text14Medium justify-between border-b-neutral300 border-b py-[12px]">
      {icon}
    </div>
  );
}

export default function VoteSuccessfulPopup({ addressVote, onClose }) {
  return (
    <Popup title="Vote" onClose={onClose}>
      <VoteSuccessfulWrapper onClose={onClose}>
        <VoteFor>
          <span>Vote for</span>
        </VoteFor>
        <VoteItem vote={addressVote} />
      </VoteSuccessfulWrapper>
    </Popup>
  );
}
