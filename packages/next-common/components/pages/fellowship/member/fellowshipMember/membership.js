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
import { CardTitle } from "./styled";
import { useMemo } from "react";
import FellowshipRank from "next-common/components/fellowship/rank";
import Divider from "next-common/components/styled/layout/divider";
import Period from "next-common/components/fellowship/params/period";

export default function Membership() {
  const { fellowshipMembers, id, fellowshipParams } = usePageProps();
  const filterMember = useMemo(() => {
    return fellowshipMembers.filter((member) => member.address === id);
  }, [fellowshipMembers, id]);
  const {
    demotionPeriod = [],
    minPromotionPeriod = [],
    offboardTimeout,
  } = fellowshipParams ?? {};

  const { membersWithStatus, isLoading } = useMembersWithStatus(filterMember);

  const ActiveMember = membersWithStatus?.[0];

  const demotionBlocks = useMemo(() => {
    return ActiveMember?.rank <= 0
      ? offboardTimeout
      : demotionPeriod[rankToIndex(ActiveMember?.rank)];
  }, [ActiveMember?.rank, demotionPeriod, offboardTimeout]);

  const promotionPeriod = useMemo(() => {
    return minPromotionPeriod[ActiveMember?.rank] || 0;
  }, [ActiveMember?.rank, minPromotionPeriod]);

  return (
    <SecondaryCard>
      <CardTitle>Membership</CardTitle>

      <div className="gap-y-3 flex flex-col">
        <ProfileFellowshipStatisticsInfoImpl rank={ActiveMember?.rank} />

        <Divider />

        <LoadableContent isLoading={isLoading || isNil(ActiveMember)}>
          <div className="flex gap-x-4">
            <div className="flex-1">
              <CoreFellowshipMemberDemotionPeriod
                lastProof={ActiveMember?.status?.lastProof}
                rank={ActiveMember?.rank}
                params={fellowshipParams}
                titleClassName="text14Medium text-textPrimary"
                progressClassName="h-[0.375rem]"
              />
              <span className="text-textTertiary text12Medium block mt-1">
                <Period blocks={demotionBlocks} />
              </span>
            </div>
            <span className="border-r border-[var(--neutral200)] w-0 block" />
            <div className="flex-1">
              {ActiveMember?.rank > 0 && (
                <CoreFellowshipMemberPromotionPeriod
                  lastPromotion={ActiveMember?.status?.lastPromotion}
                  rank={ActiveMember?.rank}
                  params={fellowshipParams}
                  titleClassName="text14Medium text-textPrimary"
                  progressClassName="h-[0.375rem]"
                />
              )}
              <span className="text-textTertiary text12Medium block mt-1">
                <Period blocks={promotionPeriod} />
              </span>
            </div>
          </div>
        </LoadableContent>
      </div>
    </SecondaryCard>
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

function ProfileFellowshipStatisticsInfoImpl({ rank }) {
  const { id: address } = usePageProps();
  const { value, loading } = useUserStatisticsData(address);

  return (
    <SummaryLayout>
      <SummaryItem title="Rank">
        <LoadableContent isLoading={loading || isNil(value?.totalPaid)}>
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
