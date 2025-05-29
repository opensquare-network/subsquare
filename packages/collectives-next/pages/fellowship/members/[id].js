import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import { backendApi } from "next-common/services/nextApi";
import {
  fellowshipMemberLastSalaryPaymentApi,
  fellowshipMembersApiUri,
  fellowshipParamsApi,
  fellowshipStatisticsMemberApi,
} from "next-common/services/url";
import FellowshipMemberPage from "next-common/components/pages/fellowship/member";

export default FellowshipMemberPage;

export const getServerSideProps = withCommonProps(async (context) => {
  const { id } = context.query;

  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipParams = {} },
    { result: lastSalaryPayment = {} },
    { result: claimantCycleStats = {} },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    backendApi.fetch(fellowshipMembersApiUri),
    backendApi.fetch(fellowshipParamsApi),
    backendApi.fetch(fellowshipMemberLastSalaryPaymentApi(id)),
    backendApi.fetch(fellowshipStatisticsMemberApi(id)),
  ]);

  return {
    props: {
      id,
      ...tracksProps,
      fellowshipMembers: fellowshipMembers ?? null,
      fellowshipParams,
      lastSalaryPayment,
      claimantCycleStats,
    },
  };
});
