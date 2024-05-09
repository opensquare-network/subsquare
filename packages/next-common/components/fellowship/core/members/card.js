import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Avatar from "next-common/components/avatar";
import React, { useMemo } from "react";
import AddressUser from "next-common/components/user/addressUser";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import FellowshipMemberDemotionPeriod from "next-common/components/fellowship/core/members/demotionPeriod";
import FellowshipMemberPromotionPeriod from "next-common/components/fellowship/core/members/promotionPeriod";
import FellowshipMemberInfoLine from "next-common/components/fellowship/core/members/line";
import FellowshipMemberInfoWrapper from "next-common/components/fellowship/core/members/infoWrapper";
import FellowshipMemberSalary from "next-common/components/fellowship/core/members/salary";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import Actions from "next-common/components/fellowship/core/members/actions";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";
import Tooltip from "next-common/components/tooltip";
import FellowshipCoreMemberEvidence from "next-common/components/fellowship/core/members/evidence";

function AvatarAndAddress({ address, isActive }) {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="relative w-10 h-10">
        <Avatar address={address} size={40} />
        <Tooltip
          className={"absolute right-0 bottom-0"}
          content={isActive ? "Active" : "Inactive"}
        >
          <SignalIndicator className="w-4 h-4" active={isActive} />
        </Tooltip>
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

export default function FellowshipCoreMemberCard({ member: _member = {} }) {
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
        <FellowshipCoreMemberEvidence address={address} />
      </div>

      <Divider className="mt-4" />
      <FellowshipMemberSalary rank={rank} isActive={isActive} />

      <Actions member={member} />
    </SecondaryCard>
  );
}
