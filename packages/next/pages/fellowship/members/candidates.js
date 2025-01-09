import FellowshipCandidatesPage from "next-common/components/pages/fellowship/candidates";
import { withCommonProps } from "next-common/lib";
import nextApi from "next-common/services/nextApi";
import { fetchOpenGovTracksProps } from "next-common/services/serverSide";
import {
  fellowshipMembersApiUri,
  fellowshipParamsApi,
} from "next-common/services/url";

export default FellowshipCandidatesPage;

export const getServerSideProps = withCommonProps(async () => {
  const [
    tracksProps,
    { result: fellowshipParams = {} },
    { result: fellowshipMembers = [] },
  ] = await Promise.all([
    fetchOpenGovTracksProps(),
    nextApi.fetch(fellowshipParamsApi),
    nextApi.fetch(fellowshipMembersApiUri),
  ]);

  return {
    props: {
      ...tracksProps,
      fellowshipParams,
      fellowshipMembers,
    },
  };
});
