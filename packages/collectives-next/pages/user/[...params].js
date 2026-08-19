import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";
import {
  fetchUserStatisticsProps,
  fetchUserRankHistoryProps,
} from "next-common/services/serverSide/fellowship/userStatistics";
import { fetchCollectiveUserProfileProps } from "next-common/services/serverSide/fellowship/userProfile";

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

  // fellowship / ambassador props are module gated, and per-tab data
  // (params, max-index, salary, heatmap, evidence) is only fetched when the
  // user is actually on the corresponding section tab
  const onFellowshipTab = activityType === "fellowship";
  const onAmbassadorTab = activityType === "ambassador";

  const [
    { result: userSummary },
    { result: user },
    fellowshipProps,
    ambassadorProps,
    userStatisticsProps,
    rankHistoryProps,
  ] = await Promise.all([
    backendApi.fetch(`users/${maybeAddress}/counts`),
    backendApi.fetch(`users/${maybeAddress}`),
    fetchCollectiveUserProfileProps(id, "fellowship", {
      active: onFellowshipTab,
      page,
    }),
    fetchCollectiveUserProfileProps(id, "ambassador", {
      active: onAmbassadorTab,
      page,
    }),
    fetchUserStatisticsProps(maybeAddress, activityType),
    fetchUserRankHistoryProps(maybeAddress, activityType),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id: maybeAddress,
      userSummary: userSummary ?? {},
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
      ...fellowshipProps,
      ...ambassadorProps,
      ...userStatisticsProps,
      ...rankHistoryProps,
    },
  };
});
