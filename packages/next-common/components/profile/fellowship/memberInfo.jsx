import { find } from "lodash-es";
import { useDemotionPeriod } from "next-common/components/collectives/core/member/demotionPeriod";
import { usePromotionPeriod } from "next-common/components/collectives/core/member/promotionPeriod";
import FellowshipRank from "next-common/components/fellowship/rank";
import RemainLabel from "next-common/components/fellowship/salary/cycles/summary/remainLabel";
import SignalIndicator from "next-common/components/icons/signalIndicator";
import { useRemainingTime } from "next-common/components/remaining";
import { NeutralPanel } from "next-common/components/styled/containers/neutralPanel";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import ValueDisplay from "next-common/components/valueDisplay";
import { usePageProps } from "next-common/context/page";
import useFetchFellowshipCoreMembers from "next-common/hooks/fellowship/core/useFetchFellowshipCoreMembers";
import { useSalaryAsset } from "next-common/hooks/useSalaryAsset";
import { fellowshipCoreMembersSelector } from "next-common/store/reducers/fellowship/core";
import { cn, toPrecision } from "next-common/utils";
import { useSelector } from "react-redux";

export default function ProfileFellowshipMemberInfo() {
  const { id: address } = usePageProps();
  useFetchFellowshipCoreMembers();
  const members = useSelector(fellowshipCoreMembersSelector);
  const member = find(members, { address });

  if (!member) {
    return null;
  }

  return <ProfileFellowshipMemberInfoImpl member={member} />;
}

function ProfileFellowshipMemberInfoImpl({ member }) {
  // FIXME: ambassador
  const { fellowshipParams } = usePageProps();
  const { activeSalary, passiveSalary } = fellowshipParams;

  const { rank, status } = member;
  const { lastProof, lastPromotion, isActive } = status || {};

  const { decimals, symbol } = useSalaryAsset();

  const demotion = useDemotionPeriod({
    rank,
    lastProof,
    params: fellowshipParams,
  });
  const demotionRemainingText = useRemainingTime(demotion.remainingBlocks);

  const promotion = usePromotionPeriod({
    rank,
    lastPromotion,
    params: fellowshipParams,
  });
  const promotionRemainingText = useRemainingTime(promotion.remainingBlocks);

  return (
    <NeutralPanel className="p-6">
      <SummaryLayout>
        <SummaryItem title="Status">
          <div
            className={cn(
              "flex items-center gap-x-2",
              isActive ? "text-green500" : "text-textDisabled",
            )}
          >
            <SignalIndicator className="w-4 h-4" active={isActive} />
            {isActive ? "Active" : "Inactive"}
          </div>
        </SummaryItem>

        <SummaryItem title="Member">
          <div className="flex items-center">
            <FellowshipRank rank={member.rank} />
          </div>
        </SummaryItem>

        <SummaryItem title="Active Salary">
          <ValueDisplay
            value={toPrecision(activeSalary[rank - 1], decimals)}
            symbol={symbol}
          />
        </SummaryItem>

        <SummaryItem title="Passive Salary">
          <ValueDisplay
            value={toPrecision(passiveSalary[rank - 1], decimals)}
            symbol={symbol}
          />
        </SummaryItem>

        <SummaryItem className="max-sm:hidden"></SummaryItem>

        <SummaryItem>
          <div className="space-y-1">
            <RemainLabel
              percentage={demotion.percentageValue}
              label={"Demotion"}
              total={demotion.demotionPeriod}
              remain={demotion.remainingBlocks}
              text={demotionRemainingText}
            />
            <RemainLabel
              percentage={promotion.percentageValue}
              label={"Promotion"}
              total={promotion.promotionPeriod}
              remain={promotion.remainingBlocks}
              text={promotionRemainingText}
            />
          </div>
        </SummaryItem>
      </SummaryLayout>
    </NeutralPanel>
  );
}
