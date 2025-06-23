import { Skeleton } from "next-common/components/skeleton";
import {
  CreatePromotionReferendumAndVoteButtons,
  CreateRetentionReferendumAndVoteButtons,
  ReferendumVoteButtons,
} from "next-common/components/pages/fellowship/member/fellowshipMember/voteButtons";
import FellowshipReferendumTitle from "next-common/components/fellowshipReferendumTitle";
import MyVote from "next-common/components/pages/fellowship/member/fellowshipMember/myVote";
import { useFellowshipCoreRelatedReferenda } from "next-common/components/collectives/core/member/relatedReferenda";

export default function EvidenceVoteBar({ address, wish }) {
  const { relatedReferenda, isLoading } =
    useFellowshipCoreRelatedReferenda(address);

  if (isLoading) {
    return <LoadingVoteBar />;
  }

  if (relatedReferenda.length > 0) {
    return (
      <div className="flex flex-col gap-[16px]">
        {relatedReferenda.map((referendum, index) => (
          <ReferendumVote key={index} {...referendum} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end text14Medium">
      <CreateReferendumAndVote who={address} wish={wish} />
    </div>
  );
}

export function MobileVoteBar({ address, wish }) {
  return (
    <footer className="sm:hidden bg-neutral100 border-neutral300 border-t p-6">
      <EvidenceVoteBar address={address} wish={wish} />
    </footer>
  );
}

function CreateReferendumAndVote({ who, wish }) {
  if (wish.toLowerCase() === "promotion") {
    return <CreatePromotionReferendumAndVoteButtons who={who} />;
  } else if (wish.toLowerCase() === "retention") {
    return <CreateRetentionReferendumAndVoteButtons who={who} />;
  }

  return null;
}

function LoadingVoteBar() {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="rounded-[4px] h-[20px] w-[276px]"></Skeleton>
      <div className="flex gap-[8px]">
        <Skeleton className="rounded-[4px] h-[40px] w-[60px]"></Skeleton>
        <Skeleton className="rounded-[4px] h-[40px] w-[60px]"></Skeleton>
      </div>
    </div>
  );
}

function ReferendumVote({ referendumIndex, referendum }) {
  const trackId = referendum?.track?.toNumber();

  return (
    <div className="flex sm:items-center sm:justify-between text14Medium flex-col sm:flex-row space-y-3 sm:space-y-0">
      <div className="flex flex-col gap-[4px]">
        <FellowshipReferendumTitle
          referendumIndex={referendumIndex}
          trackId={trackId}
        />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteButtons
        className={"grid grid-cols-2 sm:flex justify-end"}
        referendumIndex={referendumIndex}
      />
    </div>
  );
}
