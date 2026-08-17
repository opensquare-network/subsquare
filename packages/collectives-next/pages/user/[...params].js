import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";
import {
  fetchUserStatisticsProps,
  fetchUserRankHistoryProps,
} from "next-common/services/serverSide/fellowship/userStatistics";
import {
  ambassadorCoreFeedsApiUri,
  ambassadorMembersApiUri,
  ambassadorParamsApi,
  fellowshipCoreFeedsApiUri,
  fellowshipMemberHeatmapApi,
  fellowshipMemberLastSalaryPaymentApi,
  fellowshipMembersApiUri,
  fellowshipParamsApi,
  fellowshipReferendaMaxIndexApi,
} from "next-common/services/url";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id, activityType, category],
    page = 1,
  } = context.query;

  // redirect core to membership
  if (category === "core") {
    return {
      redirect: {
        permanent: true,
        destination: `/user/${id}/${activityType}/membership`,
      },
    };
  }

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const queryFeedsParams = {
    page: page,
    page_size: defaultPageSize,
    who: id,
  };

  const [
    { result: userSummary },
    { result: user },
    { result: fellowshipMembers },
    { result: ambassadorMembers },
    { result: fellowshipFeeds },
    { result: ambassadorFeeds },
    { result: lastSalaryPayment },
    { result: fellowshipParams },
    { result: ambassadorParams },
    { result: fellowshipReferendaMaxIndexResult },
    { result: fellowshipMemberHeatmap },
    userStatisticsProps,
    rankHistoryProps,
  ] = await Promise.all([
    backendApi.fetch(`users/${maybeAddress}/counts`),
    backendApi.fetch(`users/${maybeAddress}`),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(ambassadorMembersApiUri),
    backendApi.fetch(fellowshipCoreFeedsApiUri, queryFeedsParams),
    backendApi.fetch(ambassadorCoreFeedsApiUri, queryFeedsParams),
    backendApi.fetch(fellowshipMemberLastSalaryPaymentApi(id)),
    backendApi.fetch(fellowshipParamsApi),
    backendApi.fetch(ambassadorParamsApi),
    backendApi.fetch(fellowshipReferendaMaxIndexApi),
    backendApi.fetch(fellowshipMemberHeatmapApi(maybeAddress)),
    fetchUserStatisticsProps(maybeAddress, activityType),
    fetchUserRankHistoryProps(maybeAddress, activityType),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id: maybeAddress,
      userSummary: userSummary ?? {},
      fellowshipMembers: fellowshipMembers ?? null,
      ambassadorMembers: ambassadorMembers ?? null,
      fellowshipFeeds: fellowshipFeeds ?? EmptyList,
      ambassadorFeeds: ambassadorFeeds ?? EmptyList,
      lastSalaryPayment: lastSalaryPayment ?? {},
      fellowshipParams: fellowshipParams ?? {},
      ambassadorParams: ambassadorParams ?? {},
      fellowshipReferendaMaxIndex:
        fellowshipReferendaMaxIndexResult?.maxReferendumIndex ?? 0,
      fellowshipMemberHeatmap: fellowshipMemberHeatmap ?? [],
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
      ...userStatisticsProps,
      ...rankHistoryProps,
    },
  };
});
