import React, { useMemo } from "react";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import Tooltip from "next-common/components/tooltip";
import Progress from "next-common/components/progress";
import Period from "next-common/components/fellowship/params/period";
import { isNil } from "lodash-es";
import useSubFellowshipCoreMember from "next-common/hooks/fellowship/core/useSubFellowshipCoreMember";

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

function getFellowshipMemberStatus(address) {
  const { member: statusFromStorage, isLoading } =
    useSubFellowshipCoreMember(address);

  const memberStatus = useMemo(() => {
    return statusFromStorage || null;
  }, [statusFromStorage, isLoading]);

  return memberStatus;
}

function DemotionPeriodProgress({ address, params, rank }) {
  if (isNil(address) || isNil(params)) {
    return null;
  }

  const memberStatus = getFellowshipMemberStatus(address);

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

function PromotionPeriodProgress({ address, params, rank }) {
  if (isNil(address) || isNil(params)) {
    return null;
  }

  const memberStatus = getFellowshipMemberStatus(address);

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
  params,
  rank,
  blocks,
}) {
  return (
    <div className="max-sm:text-right" key={keyPrefix}>
      <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />
      <div className="py-[6px] max-sm:w-32">
        <DemotionPeriodProgress
          key={`${keyPrefix}-progress-${periodKey}`}
          address={address}
          params={params}
          rank={rank}
        />
      </div>
    </div>
  );
}

export function PromotionPeriodWithProgress({
  keyPrefix,
  periodKey,
  address,
  params,
  rank,
  blocks,
}) {
  return (
    <div className="max-sm:text-right" key={keyPrefix}>
      <Period key={`${keyPrefix}-${periodKey}`} blocks={blocks} />
      <div className="py-[6px] max-sm:w-32">
        <PromotionPeriodProgress
          key={`${keyPrefix}-progress-${periodKey}`}
          address={address}
          params={params}
          rank={rank}
        />
      </div>
    </div>
  );
}
