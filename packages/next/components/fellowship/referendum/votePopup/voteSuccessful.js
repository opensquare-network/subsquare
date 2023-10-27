import { Aye, Nay } from "next-common/components/profile/votingHistory/common";
import { VoteSuccessfulWrapper, VoteFor } from "next-common/components/vote";

export function VoteItem({ vote }) {
  if (!vote) {
    return null;
  }

  let icon = null;
  let rank = 0;
  if (vote.aye) {
    icon = <Aye />;
    rank = vote.aye;
  } else {
    icon = <Nay />;
    rank = vote.nay;
  }

  return (
    <div className="flex text14Medium justify-between border-b-neutral300 border-b py-[12px]">
      {icon}
      <span className="text-textPrimary">{rank}</span>
    </div>
  );
}

export default function VoteSuccessful({ vote, onClose }) {
  return (
    <VoteSuccessfulWrapper onClose={onClose}>
      <VoteFor>
        <span>Vote for</span>
      </VoteFor>
      <VoteItem vote={vote} />
    </VoteSuccessfulWrapper>
  );
}
