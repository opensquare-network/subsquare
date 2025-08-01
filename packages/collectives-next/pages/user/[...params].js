import { withCommonProps } from "next-common/lib";
import { backendApi } from "next-common/services/nextApi";
import Profile from "next-common/components/profile";
import { defaultPageSize, EmptyList } from "next-common/utils/constants";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { tryConvertToSubstrateAddress } from "next-common/utils/mixedChainUtil";
import {
  ambassadorCoreFeedsApiUri,
  ambassadorMembersApiUri,
  fellowshipCoreFeedsApiUri,
  fellowshipMemberLastSalaryPaymentApi,
  fellowshipMembersApiUri,
} from "next-common/services/url";

export default Profile;

export const getServerSideProps = withCommonProps(async (context) => {
  const {
    params: [id],
    page = 1,
  } = context.query;

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
  ] = await Promise.all([
    backendApi.fetch(`users/${maybeAddress}/counts`),
    backendApi.fetch(`users/${maybeAddress}`),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(ambassadorMembersApiUri),
    backendApi.fetch(fellowshipCoreFeedsApiUri, queryFeedsParams),
    backendApi.fetch(ambassadorCoreFeedsApiUri, queryFeedsParams),
    backendApi.fetch(fellowshipMemberLastSalaryPaymentApi(id)),
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
      user: user ?? {},
      route: context.query?.params?.slice(1)?.join("/") ?? "",
      ...tracksProps,
    },
  };
});
