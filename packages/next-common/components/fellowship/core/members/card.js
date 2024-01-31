import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Avatar from "next-common/components/avatar";
import React from "react";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import FellowshipMemberDemotionPeriod from "next-common/components/fellowship/core/members/demotionPeriod";
import FellowshipMemberPromotionPeriod from "next-common/components/fellowship/core/members/promotionPeriod";
import FellowshipMemberInfoLine from "next-common/components/fellowship/core/members/line";
import FellowshipMemberInfoWrapper from "next-common/components/fellowship/core/members/infoWrapper";
import FellowshipMemberSalary from "next-common/components/fellowship/core/members/salary";
import SignalIndicator from "next-common/components/icons/signalIndicator";

function AvatarAndAddress({ address, isActive }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="relative w-10 h-10">
        <Avatar address={address} size={40} />
        <SignalIndicator
          className="absolute right-0 bottom-0"
          active={isActive}
        />
      </div>

      <AddressUser
        add={address}
        showAvatar={false}
        fontSize={14}
        className="[&_.identity]:!font-semibold"
      />
    </div>
  );
}

export default function FellowshipCoreMemberCard({ member = {} }) {
  const {
    address,
    rank,
    status: { isActive, lastPromotion, lastProof } = {},
  } = member;

  return (
    <SecondaryCard>
      <div className="flex justify-between">
        <AvatarAndAddress address={address} isActive={isActive} />
        <FellowshipRank rank={rank} />
      </div>
      <Divider className="mt-4" />
      <FellowshipMemberInfoLine>
        <FellowshipMemberDemotionPeriod lastProof={lastProof} rank={rank} />
        {rank > 0 ? (
          <FellowshipMemberPromotionPeriod
            lastPromotion={lastPromotion}
            rank={rank}
          />
        ) : (
          <FellowshipMemberInfoWrapper /> // as a placeholder
        )}
      </FellowshipMemberInfoLine>

      <Divider className="mt-4" />
      <FellowshipMemberSalary rank={rank} isActive={isActive} />
    </SecondaryCard>
  );
}
