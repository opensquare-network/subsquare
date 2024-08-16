import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import Tooltip from "next-common/components/tooltip";
import Progress from "next-common/components/progress";

function findCoreMember(coreMembers, address) {
  return coreMembers.find((member) => member.address === address) || null;
}

function NotInCoreManagementSystem() {
  return (
    <div className="p-[6px]">
      <Tooltip className="block" content="Not in core management system">
        <Progress
          className="h-1"
          percentage={0}
          bg="var(--neutral200)"
          fg="var(--neutral200)"
        />
      </Tooltip>
    </div>
  );
}

export default function MemberPeriodProgress({
  members,
  address,
  params,
  rank,
  coreMembers,
  type = "demotion",
}) {
  if (!members || !address || !params || !coreMembers) {
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
      <div className="p-[6px]">
        <CoreFellowshipMemberDemotionPeriod
          lastProof={lastProof}
          rank={rank}
          params={params}
          showTitle={false}
        />
      </div>
    );
  } else {
    return (
      rank > 0 && (
        <div className="p-[6px]">
          <CoreFellowshipMemberPromotionPeriod
            lastPromotion={lastPromotion}
            rank={rank}
            params={params}
            showTitle={false}
          />
        </div>
      )
    );
  }
}
