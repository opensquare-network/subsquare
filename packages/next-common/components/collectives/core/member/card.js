import React from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AvatarAndAddress from "next-common/components/collectives/core/member/avatarAndAddress";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import CoreFellowshipMemberInfoLine from "next-common/components/collectives/core/member/line";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import { CoreFellowshipMemberEvidence } from "next-common/components/collectives/core/member/evidence";
import CoreFellowshipMemberSalary from "./salary";
import { CoreFellowshipMemberRelatedReferendaActions } from "./relatedReferenda";
import MineTag from "next-common/components/delegation/delegate/common/mineTag";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { isSameAddress } from "next-common/utils";

export default function CoreFellowshipMemberCard({
  member,
  params,
  pallet,
  children,
}) {
  const realAddress = useRealAddress();
  const { address, rank } = member;
  const { isActive, lastPromotion, lastProof } = member.status;

  return (
    <SecondaryCard className="relative">
      {isSameAddress(realAddress, address) && <MineTag />}
      <div className="flex justify-between">
        <AvatarAndAddress address={address} isActive={isActive} />
        <div className="flex flex-col items-end justify-between">
          <FellowshipRank rank={rank} />
          <CoreFellowshipMemberSalary
            className="text12Medium"
            member={member}
            params={params}
          />
        </div>
      </div>
      <Divider className="mt-4" />
      <div className="flex flex-col grow gap-4">
        <CoreFellowshipMemberInfoLine>
          <CoreFellowshipMemberDemotionPeriod
            lastProof={lastProof}
            rank={rank}
            params={params}
          />
          {rank > 0 && (
            <CoreFellowshipMemberPromotionPeriod
              lastPromotion={lastPromotion}
              rank={rank}
              params={params}
            />
          )}
        </CoreFellowshipMemberInfoLine>
        <CoreFellowshipMemberInfoLine>
          <CoreFellowshipMemberEvidence member={member} pallet={pallet} />
          <CoreFellowshipMemberRelatedReferendaActions
            address={address}
            pallet={pallet}
          />
        </CoreFellowshipMemberInfoLine>
      </div>

      <Divider className="mt-4" />

      {children}
    </SecondaryCard>
  );
}
