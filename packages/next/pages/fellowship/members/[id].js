import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipMemberLastSalaryPaymentApi,
  fellowshipMembersApiUri,
  fellowshipParamsApi,
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
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipMembersApiUri),
    nextApi.fetch(fellowshipParamsApi),
    nextApi.fetch(fellowshipMemberLastSalaryPaymentApi(id)),
  ]);

  return {
    props: {
      id,
      ...tracksProps,
      fellowshipMembers: fellowshipMembers ?? null,
      fellowshipParams,
      lastSalaryPayment,
    },
  };
});
