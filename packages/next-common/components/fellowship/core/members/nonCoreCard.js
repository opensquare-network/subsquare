import React from "react";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import AvatarAndAddress from "next-common/components/collectives/core/member/avatarAndAddress";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import MineTag from "next-common/components/delegation/delegate/common/mineTag";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import CoreFellowshipMemberSalary from "next-common/components/collectives/core/member/salary";

export default function NonCoreFellowshipMemberCard({ member, params }) {
  const realAddress = useRealAddress();
  const { address, rank } = member;

  return (
    <SecondaryCard className="relative">
      {realAddress === address && <MineTag />}
      <div className="flex justify-between">
        <AvatarAndAddress address={address} isActive={false} />
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
      <div className="flex items-center justify-center h-[152px] mt-4">
        <span className="text14Medium text-textTertiary">
          Not in core management system
        </span>
      </div>
    </SecondaryCard>
  );
}
