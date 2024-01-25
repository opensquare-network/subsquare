import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Avatar from "next-common/components/avatar";
import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import FellowshipMemberDemotionPeriod from "next-common/components/fellowship/core/members/demotionPeriod";
import FellowshipMemberPromotionPeriod from "next-common/components/fellowship/core/members/promotionPeriod";
import FellowshipMemberInfoLine from "next-common/components/fellowship/core/members/line";

function AvatarAndAddress({ address }) {
  return (
    <div className="flex flex-col gap-y-2">
      <Avatar address={address} size={40} />
      <AddressUser add={address} showAvatar={false} fontSize={14} />
    </div>
  );
}

export default function FellowshipCoreMemberCard({ member = {} }) {
  const {
    address,
    rank,
    status: {
      // isActive, // todo: we should show active status to user
      lastPromotion,
      lastProof,
    } = {},
  } = member;

  return (
    <SecondaryCard>
      <div className="flex justify-between">
        <AvatarAndAddress address={address} />
        <FellowshipRank rank={rank} />
      </div>
      <Divider className="mt-4" />
      <FellowshipMemberInfoLine>
        <FellowshipMemberDemotionPeriod lastProof={lastProof} rank={rank} />
        <FellowshipMemberPromotionPeriod
          lastPromotion={lastPromotion}
          rank={rank}
        />
      </FellowshipMemberInfoLine>
    </SecondaryCard>
  );
}
