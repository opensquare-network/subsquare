import { useAsync } from "react-use";
import { isNil } from "lodash-es";
import LoadableContent from "next-common/components/common/loadableContent";
import { SecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import { usePageProps } from "next-common/context/page";
import rankToIndex from "next-common/utils/fellowship/rankToIndex";
import SummaryItem from "next-common/components/summary/layout/item";
import SummaryLayout from "next-common/components/summary/layout/layout";
import nextApi from "next-common/services/nextApi";
import { fellowshipStatisticsUsersApi } from "next-common/services/url";
import { useMembersWithStatus } from "next-common/components/fellowship/collective/hook/useFellowshipCoreMembersFilter";
import CoreFellowshipMemberDemotionPeriod from "next-common/components/collectives/core/member/demotionPeriod";
import CoreFellowshipMemberPromotionPeriod from "next-common/components/collectives/core/member/promotionPeriod";
import { useIsMobile } from "next-common/components/overview/accountInfo/components/accountBalances";
import { CardTitle } from "./styled";
import { useMemo } from "react";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import Period from "next-common/components/fellowship/params/period";
import { cn } from "next-common/utils";
import WindowSizeProvider from "next-common/context/windowSize";
import CoretimeSalePanelChartSkeleton from "next-common/components/coretime/salePanel/chart/skeleton";

export default function Membership() {
  const { fellowshipMembers, id, fellowshipParams } = usePageProps();
  const filterMember = useMemo(() => {
    return fellowshipMembers.filter((member) => member.address === id);
  }, [fellowshipMembers, id]);

  const { membersWithStatus, isLoading } = useMembersWithStatus(filterMember);

  const activeMember = membersWithStatus?.[0];

  return (
    <WindowSizeProvider>
      <SecondaryCard>
        <CardTitle>Membership</CardTitle>

        {isLoading ? (
          <MembershipLoading />
        ) : activeMember ? (
          <div className="gap-y-4 flex flex-col">
            <ProfileFellowshipStatisticsInfoImpl
              rank={activeMember?.rank}
              isRankLoading={isLoading || isNil(activeMember)}
            />

            <Divider />

            <PeriodProgress
              fellowshipParams={fellowshipParams}
              activeMember={activeMember}
              isLoading={isLoading || isNil(activeMember)}
            />
          </div>
        ) : (
          <NotImported />
        )}
      </SecondaryCard>
    </WindowSizeProvider>
  );
}

function useUserStatisticsData(address) {
  let statisticsApi = fellowshipStatisticsUsersApi(address);

  return useAsync(async () => {
    if (!statisticsApi) {
      return;
    }

    const resp = await nextApi.fetch(statisticsApi);

    return resp?.result;
  }, [address, statisticsApi]);
}

function ProfileFellowshipStatisticsInfoImpl({ rank, isRankLoading }) {
  const { id: address } = usePageProps();
  const { value, loading } = useUserStatisticsData(address);

  return (
    <SummaryLayout>
      <SummaryItem title="Rank">
        <LoadableContent isLoading={isRankLoading}>
          <FellowshipRank rank={rank} />
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Promotion">
        <LoadableContent isLoading={loading || isNil(value?.promotionTimes)}>
          {value?.promotionTimes}
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Demotion">
        <LoadableContent isLoading={loading || isNil(value?.demotionTimes)}>
          {value?.demotionTimes}
        </LoadableContent>
      </SummaryItem>
      <SummaryItem title="Retention">
        <LoadableContent isLoading={loading || isNil(value?.retentionTimes)}>
          {value?.retentionTimes}
        </LoadableContent>
      </SummaryItem>
    </SummaryLayout>
  );
}

function PeriodProgress({ activeMember, fellowshipParams, isLoading }) {
  const isMobile = useIsMobile();
  const {
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = fellowshipParams ?? {};

  const demotionBlocks = useMemo(() => {
    return activeMember?.rank <= 0
      ? offboardTimeout
      : demotionPeriod[rankToIndex(activeMember?.rank)];
  }, [activeMember?.rank, demotionPeriod, offboardTimeout]);

  const promotionPeriod = useMemo(() => {
    return minPromotionPeriod[activeMember?.rank] || 0;
  }, [activeMember?.rank, minPromotionPeriod]);

  return (
    <div className={cn("flex gap-x-4", { "flex-col gap-y-4": isMobile })}>
      <div className="flex-1">
        <LoadableContent isLoading={isLoading}>
          <CoreFellowshipMemberDemotionPeriod
            lastProof={activeMember?.status?.lastProof}
            rank={activeMember?.rank}
            params={fellowshipParams}
            titleClassName="text14Medium text-textPrimary"
            progressClassName="h-[0.375rem]"
          />
          <span className="text-textTertiary text12Medium flex mt-1">
            <Period blocks={demotionBlocks} suffix=" remaining" />
          </span>
        </LoadableContent>
      </div>
      <span
        className={cn("border-r border-[var(--neutral200)] w-0 block", {
          "w-full border-t": isMobile,
        })}
      />
      <div className="flex-1">
        <LoadableContent isLoading={isLoading}>
          {activeMember?.rank > 0 && (
            <CoreFellowshipMemberPromotionPeriod
              lastPromotion={activeMember?.status?.lastPromotion}
              rank={activeMember?.rank}
              params={fellowshipParams}
              titleClassName="text14Medium text-textPrimary"
              progressClassName="h-[0.375rem]"
            />
          )}
          <span className="text-textTertiary text12Medium flex mt-1">
            <Period blocks={promotionPeriod} suffix=" remaining" />
          </span>
        </LoadableContent>
      </div>
    </div>
  );
}

function NotImported() {
  return (
    <div className="py-[16px] text-center">
      <span className="text14Medium text-textTertiary">
        Not imported in the management system
      </span>
    </div>
  );
}

function MembershipLoading() {
  return (
    <>
      <CoretimeSalePanelChartSkeleton className="h-5 w-1/6" />
      <CoretimeSalePanelChartSkeleton className="h-5 mt-2" />
      <CoretimeSalePanelChartSkeleton className="h-5 mt-2" />
    </>
  );
}
