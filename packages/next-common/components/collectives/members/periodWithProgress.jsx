import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import Tooltip from "next-common/components/tooltip";
import Progress from "next-common/components/progress";
import Period from "next-common/components/fellowship/params/period";
import { isNil } from "lodash-es";

function findCoreMember(coreMembers, address) {
  return coreMembers.find((member) => member.address === address) || null;
}

function NotInCoreManagementSystem() {
  return (
    <Tooltip className="block" content="Not in core management system">
      <Progress
        className="h-1"
        percentage={0}
        bg="var(--neutral200)"
        fg="var(--neutral200)"
      />
    </Tooltip>
  );
}

function PeriodProgress({
  members,
  address,
  params,
  rank,
  coreMembers,
  type = "demotion",
}) {
  if (isNil(members) || isNil(address) || isNil(params) || isNil(coreMembers)) {
    return null;
  }
  const memberStatus = findCoreMember(coreMembers, address);

  if (!memberStatus) {
    return <NotInCoreManagementSystem />;
  }

  const { status } = memberStatus;
  const { lastProof, lastPromotion } = status;
  if (type === "demotion") {
    return (
      <CoreFellowshipMemberDemotionPeriod
        lastProof={lastProof}
        rank={rank}
        params={params}
        showTitle={false}
      />
    );
  } else {
    return (
      rank > 0 && (
        <CoreFellowshipMemberPromotionPeriod
          lastPromotion={lastPromotion}
          rank={rank}
          params={params}
          showTitle={false}
        />
      )
    );
  }
}

export default function MemberPeriodWithProgress({
  keyPrefix,
  periodKey,
  members,
  address,
  params,
  rank,
  coreMembers,
  type,
  blocks,
}) {
  return (
    <div className="max-sm:text-right" key={keyPrefix}>
      <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />
      <div className="py-[6px] max-sm:w-32">
        <PeriodProgress
          key={`${keyPrefix}-progress-${periodKey}`}
          members={members}
          address={address}
          params={params}
          rank={rank}
          coreMembers={coreMembers}
          type={type}
        />
      </div>
    </div>
  );
}
