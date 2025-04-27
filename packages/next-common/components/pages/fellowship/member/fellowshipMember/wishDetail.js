import Divider from "next-common/components/styled/layout/divider";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { WishBar } from "./wishBar";
import { useFellowshipCoreRelatedReferenda } from "next-common/components/collectives/core/member/relatedReferenda";
import FellowshipReferendumTitle from "next-common/components/fellowshipReferendumTitle";
import MyVote from "./myVote";
import {
  CreatePromotionReferendumAndVoteButtons,
  CreateRetentionReferendumAndVoteButtons,
  ReferendumVoteButtons,
} from "./voteButtons";

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

function VoteBar({ address, wish }) {
  const { relatedReferenda, isLoading } =
    useFellowshipCoreRelatedReferenda(address);

  if (isLoading) {
    return null;
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

function WishPanel({ address, activeMember }) {
  const { loading, wish } = useSubCoreFellowshipEvidence(address);

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <WishBar wish={wish} activeMember={activeMember} address={address} />
      <VoteBar address={address} wish={wish} />
    </div>
  );
}

export default function WishDetail({ activeMember, address, ifpsContent }) {
  return (
    <div className="gap-y-4 flex flex-col">
      <WishPanel address={address} activeMember={activeMember} />
      <Divider />
      <IpfsEvidenceRawContent key="detail-content" value={ifpsContent} />
    </div>
  );
}
