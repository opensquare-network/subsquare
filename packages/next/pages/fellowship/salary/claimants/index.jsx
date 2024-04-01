import FellowshipSalaryCommon from "next-common/components/fellowship/salary/common";
import FellowshipSalaryClaimantsContainer from "next-common/components/fellowship/salary/claimants/container";
import { withCommonProps } from "next-common/lib";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import nextApi from "next-common/services/nextApi";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
  fellowshipSalaryClaimantsApi,
} from "next-common/services/url";

export default function FellowshipSalaryClaimantsPage() {
  return (
    <FellowshipSalaryCommon>
      <FellowshipSalaryClaimantsContainer />
    </FellowshipSalaryCommon>
  );
}

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipMembers },
    { result: fellowshipParams = {} },
    { result: fellowshipSalaryClaimants },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipMembersApiUri),
    nextApi.fetch(fellowshipParamsApi),
    nextApi.fetch(fellowshipSalaryClaimantsApi),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipMembers,
      fellowshipParams,
      fellowshipSalaryClaimants,
    },
  };
});
