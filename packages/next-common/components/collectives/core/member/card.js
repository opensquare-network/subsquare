import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AvatarAndAddress from "next-common/components/collectives/core/member/avatarAndAddress";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import React from "react";
import CoreFellowshipMemberInfoLine from "next-common/components/collectives/core/member/line";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberEvidence from "next-common/components/collectives/core/member/evidence";
import CoreFellowshipMemberSalary from "next-common/components/collectives/core/member/salary";

export default function CoreFellowshipMemberCard({
  member,
  params,
  pallet,
  children,
}) {
  const { address, rank } = member;
  const { isActive, lastPromotion, lastProof } = member.status;

  return (
    <SecondaryCard>
      <div className="flex justify-between">
        <AvatarAndAddress address={address} isActive={isActive} />
        <FellowshipRank rank={rank} />
      </div>
      <Divider className="mt-4" />
      <div className="flex flex-col grow gap-4">
        <CoreFellowshipMemberInfoLine>
          <CoreFellowshipMemberDemotionPeriod
            lastProof={lastProof}
            rank={rank}
            params={params}
          />
          {rank > 0 ? (
            <CoreFellowshipMemberPromotionPeriod
              lastPromotion={lastPromotion}
              rank={rank}
              params={params}
            />
          ) : (
            <CoreFellowshipMemberInfoWrapper /> // as a placeholder
          )}
        </CoreFellowshipMemberInfoLine>
        <CoreFellowshipMemberEvidence address={address} pallet={pallet} />
      </div>

      <Divider className="mt-4" />
      <CoreFellowshipMemberSalary
        rank={rank}
        isActive={isActive}
        params={params}
      />

      {children}
    </SecondaryCard>
  );
}
