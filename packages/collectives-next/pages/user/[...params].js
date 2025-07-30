import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";
import {
  ambassadorMembersApiUri,
  fellowshipCoreFeedsApiUri,
  fellowshipMembersApiUri,
} from "next-common/services/url";

export default Profile;

const getQueryInductedFeedsParams = (id) => ({
  page: 0,
  page_size: 10,
  who: id,
  event: "Inducted",
});

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
  } = context.query;

  const maybeAddress = tryConvertToSubstrateAddress(id);

  const [
    { result: userSummary },
    { result: user },
    { result: fellowshipMembers },
    { result: ambassadorMembers },
    { result: fellowshipInductedFeeds = [] },
  ] = await Promise.all([
    backendApi.fetch(`users/${maybeAddress}/counts`),
    backendApi.fetch(`users/${maybeAddress}`),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(ambassadorMembersApiUri),
    backendApi.fetch(
      fellowshipCoreFeedsApiUri,
      getQueryInductedFeedsParams(id),
    ),
  ]);
  const tracksProps = await fetchOpenGovTracksProps();

  return {
    props: {
      id: maybeAddress,
      userSummary: userSummary ?? {},
      fellowshipMembers: fellowshipMembers ?? null,
      ambassadorMembers: ambassadorMembers ?? null,
      fellowshipInductedFeeds: fellowshipInductedFeeds ?? null,
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
    },
  };
});
