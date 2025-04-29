import Divider from "next-common/components/styled/layout/divider";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import { WishBar } from "./wishBar";
import { useFellowshipCoreRelatedReferenda } from "next-common/components/collectives/core/member/relatedReferenda";
import FellowshipReferendumTitle from "next-common/components/fellowshipReferendumTitle";
import MyVote from "./myVote";
import {
  CreatePromotionReferendumAndVoteButtons,
  CreateRetentionReferendumAndVoteButtons,
  ReferendumVoteButtons,
} from "./voteButtons";
import { Skeleton } from "next-common/components/skeleton";

function ReferendumVote({ referendumIndex, referendum }) {
  const trackId = referendum?.track?.toNumber();

  return (
    <div className="flex items-center justify-between text14Medium">
      <div className="flex flex-col gap-[4px]">
        <FellowshipReferendumTitle
          referendumIndex={referendumIndex}
          trackId={trackId}
        />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteButtons referendumIndex={referendumIndex} />
    </div>
  );
}

function CreateReferendumAndVote({ who, wish }) {
  if (wish.toLowerCase() === "promotion") {
    return (
      <div className="flex items-center justify-end text14Medium">
        <CreatePromotionReferendumAndVoteButtons who={who} />
      </div>
    );
  } else if (wish.toLowerCase() === "retention") {
    return (
      <div className="flex items-center justify-end text14Medium">
        <CreateRetentionReferendumAndVoteButtons who={who} />
      </div>
    );
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

function VoteBar({ address, wish }) {
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

  return <CreateReferendumAndVote who={address} wish={wish} />;
}

function WishPanel({ address, activeMember, wish }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <WishBar wish={wish} activeMember={activeMember} address={address} />
      <VoteBar address={address} wish={wish} />
    </div>
  );
}

export default function WishDetail({
  activeMember,
  address,
  ifpsContent,
  wish,
}) {
  return (
    <div className="gap-y-4 flex flex-col">
      <WishPanel address={address} activeMember={activeMember} wish={wish} />
      <Divider />
      <IpfsEvidenceRawContent key="detail-content" value={ifpsContent} />
    </div>
  );
}
