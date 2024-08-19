import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import Tooltip from "next-common/components/tooltip";
import Progress from "next-common/components/progress";
import Period from "next-common/components/fellowship/params/period";
import { isNil } from "lodash-es";
import useSubCoreCollectivesMember from "next-common/hooks/collectives/useSubCoreCollectivesMember";
import {
  useCollectivesContext,
  useCoreFellowshipPallet,
} from "next-common/context/collectives/collectives";

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

function DemotionPeriodProgress({ memberStatus, rank }) {
  const { params } = useCollectivesContext();

  if (isNil(params)) {
    return null;
  }

  if (isNil(memberStatus)) {
    return <NotInCoreManagementSystem />;
  }

  const { lastProof } = memberStatus;

  return (
    <CoreFellowshipMemberDemotionPeriod
      lastProof={lastProof}
      rank={rank}
      params={params}
      showTitle={false}
    />
  );
}

function PromotionPeriodProgress({ memberStatus, rank }) {
  const { params } = useCollectivesContext();

  if (isNil(params)) {
    return null;
  }

  if (!memberStatus) {
    return <NotInCoreManagementSystem />;
  }

  const { lastPromotion } = memberStatus;

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

export function DemotionPeriodWithProgress({
  keyPrefix,
  periodKey,
  address,
  rank,
  blocks,
}) {
  if (isNil(address)) {
    return null;
  }

  const { section } = useCollectivesContext();
  const isFellowshipSection = section === "fellowship";

  const corePallet = useCoreFellowshipPallet();
  const { member: memberStatus } = useSubCoreCollectivesMember(
    address,
    corePallet,
  );

  if (isFellowshipSection) {
    return (
      <div className="max-sm:text-right" key={keyPrefix}>
        <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />
        <div className="py-[6px] max-sm:w-32">
          <DemotionPeriodProgress
            key={`${keyPrefix}-progress-${periodKey}`}
            rank={rank}
            memberStatus={memberStatus}
          />
        </div>
      </div>
    );
  }
  return <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />;
}

export function PromotionPeriodWithProgress({
  keyPrefix,
  periodKey,
  address,
  rank,
  blocks,
}) {
  const { section } = useCollectivesContext();
  const isFellowshipSection = section === "fellowship";

  if ((blocks <= 0 && isFellowshipSection) || isNil(address)) {
    return null;
  }

  const corePallet = useCoreFellowshipPallet();
  const { member: memberStatus } = useSubCoreCollectivesMember(
    address,
    corePallet,
  );

  if (isFellowshipSection) {
    return (
      <div className="max-sm:text-right" key={keyPrefix}>
        <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />
        <div className="py-[6px] max-sm:w-32">
          <PromotionPeriodProgress
            key={`${keyPrefix}-progress-${periodKey}`}
            rank={rank}
            memberStatus={memberStatus}
          />
        </div>
      </div>
    );
  }

  return <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />;
}
