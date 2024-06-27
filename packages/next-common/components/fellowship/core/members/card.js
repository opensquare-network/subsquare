import React, { useMemo } from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import FellowshipMemberSalary from "next-common/components/fellowship/core/members/salary";
import Actions from "next-common/components/fellowship/core/members/actions";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import AvatarAndAddress from "next-common/components/collectives/core/member/avatarAndAddress";
import CoreFellowshipMemberInfoLine from "next-common/components/collectives/core/member/line";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberInfoWrapper from "next-common/components/collectives/core/member/infoWrapper";
import CoreFellowshipMemberEvidence from "next-common/components/collectives/core/member/evidence";

export default function FellowshipCoreMemberCard({
  member: _member = {},
  params = {},
}) {
  const { member: statusFromStorage } = useSubFellowshipCoreMember(
    _member.address,
  );

  const member = useMemo(() => {
    return {
      ..._member,
      status: statusFromStorage || _member.status || {},
    };
  }, [_member, statusFromStorage]);

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
        <CoreFellowshipMemberEvidence
          address={address}
          pallet="fellowshipCore"
        />
      </div>

      <Divider className="mt-4" />
      <FellowshipMemberSalary rank={rank} isActive={isActive} />

      <Actions member={member} />
    </SecondaryCard>
  );
}
